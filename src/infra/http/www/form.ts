import { type ServerRenderedTemplate, html } from '@lit-labs/ssr';
import { type Request, type Response } from 'express';
import { type ZodError, type z, type ZodType } from 'zod';

export class ActionError extends Error {}

interface Field<T = unknown> {
  initialValue: T
  name: string
  render: (props: { name: string, value: T, endpoint: string, errors?: string[] }) => ServerRenderedTemplate
}

export function field<T>({ name, initialValue, render }: Field<T>) {
  return {
    discriminator: 'form-field',
    name,
    initialValue,
    render
  };
}

function isField(value: any): value is Field {
  return typeof value === 'object' && value.discriminator === 'form-field';
}

interface FormConstructor<TSchema extends ZodType<any, any, any> = z.AnyZodObject, TSchemaData = z.infer<TSchema>> {
  route: string
  schema: (req: Request) => TSchema
  action: (ctx: {
    data: TSchemaData
    req: Request
    res: Response
  }) => any
  render: (props: { route: string, actionError?: string }) => ServerRenderedTemplate
}

type FormErrors<TSchemaData> = {
  [K in keyof TSchemaData]?: string[]

}

export class Form<TSchema extends z.AnyZodObject, TSchemaData = z.infer<TSchema>> {
  route: string;
  schema: (req: Request) => TSchema;
  action: (ctx: {
    data: TSchemaData
    req: Request
    res: Response
  }) => any;

  render: (params?: { actionError?: string, data?: TSchemaData, errors?: FormErrors<TSchemaData> }) => ServerRenderedTemplate;
  fields: Record<keyof TSchemaData, Field<TSchemaData[keyof TSchemaData]>>;
  controller: (req: Request, res: Response) => any;

  constructor({ route, schema, action, render }: FormConstructor<TSchema, TSchemaData>) {
    this.route = route;
    this.schema = schema;
    this.action = action;
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    this.fields = {} as Record<keyof TSchemaData, Field<TSchemaData[keyof TSchemaData]>>;

    render({ route }).values.forEach(value => {
      if (!isField(value)) {
        return;
      }

      const field = value;

      // @ts-expect-error - We know this is a field
      this.fields[field.name] = field;
    });

    this.controller = async (req, res) => {
      const validationSchema = this.schema(req);

      const field = this.fields[req.query.field as keyof TSchemaData];

      if (field) {
        const validation = await validationSchema.pick({ [field.name]: true }).spa({ [field.name]: req.body[field.name] });
        if (validation.success) {
          return res.renderTemplate(
            field.render({
              name: field.name,
              value: validation.data[field.name],
              endpoint: `${this.route}?field=${field.name}`
            })
          );
        }

        return res.renderTemplate(
          field.render({
            name: field.name,
            value: req.body[field.name],
            endpoint: `${this.route}?field=${field.name}`,
            errors: validation.error.flatten().fieldErrors[field.name]
          })
        );
      }

      const validation = await validationSchema.spa(req.body);

      if (!validation.success) {
        return res.renderTemplate(
          this.render({ data: req.body, errors: validation.error.flatten().fieldErrors })
        );
      }

      const data = validation.data as TSchemaData;
      try {
        await this.action({ data, req, res });
        return;
      } catch (error) {
        const actionError = error instanceof Error ? error.message : 'Unknown action error';

        return res.renderTemplate(
          this.render({ data, actionError })
        );
      }
    };

    this.render = (params) => {
      const { strings, values } = render({ route, actionError: params?.actionError });

      const newValues: unknown[] = [];
      values.forEach(value => {
        if (!isField(value)) {
          newValues.push(value);
          return;
        }

        const field = value;

        const renderedField = field.render({
          name: field.name,
          value: params?.data?.[field.name as keyof TSchemaData] ?? field.initialValue,
          errors: params?.errors?.[field.name as keyof TSchemaData],
          endpoint: `${route}?field=${field.name}`
        });

        newValues.push(renderedField);
      });

      return html(strings, ...newValues);
    };
  }
}
