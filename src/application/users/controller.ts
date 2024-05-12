import { Router } from 'express';
import { layout } from '@/src/infra/http/www/templates/layout';
import { signInPage } from '@/src/infra/http/www/templates/pages/sign-in';
import { signUpPage } from '@/src/infra/http/www/templates/pages/sign-up';
import { signIn } from './use-cases/sign-in';
import { signUp } from './use-cases/sign-up';
import { userUnauthenticated } from './middlewares/user-unauthenticated';
import { emailAvailable } from './use-cases/email-available';
import { signUpForm } from '@/src/infra/http/www/templates/forms/sign-up';
import { signInForm } from '@/src/infra/http/www/templates/forms/sign-in';
import { forgotPassword } from '@/src/infra/http/www/templates/pages/forgot-password';
import { sendPasswordRecoveryEmail } from './use-cases/send-password-recovery-email';
import { recoveryEmailSent } from '@/src/infra/http/www/templates/pages/recovery-email-sent';
import { passwordRecoveryPage } from '@/src/infra/http/www/templates/pages/password-recovery';
import { isTokenValid } from './use-cases/is-token-valid';
import { recoverPassword } from './use-cases/recover-password';
import { authRequestSchema, emailSchema, passwordRecoveryRequestSchema } from './zod-schemas';
import { logger } from '@/src/infra/logger';
import { createExampleProfile } from '../profiles/use-cases/create-example-profile';

export const usersController = Router();

usersController.get('/sign-in',
  userUnauthenticated,
  (req, res) => {
    return res.renderTemplate(
      layout({
        body: signInPage()
      })
    );
  });

usersController.post('/sign-in',
  userUnauthenticated,
  async (req, res) => {
    try {
      const data = authRequestSchema.parse(req.body);
      req.session.user = await signIn(data);
      return res
        .setHeader('HX-Push-Url', '/news')
        .setHeader('HX-Redirect', '/news')
        .end();
    } catch (error) {
      const signInFormData = {
        email: {
          value: req.body.email
        },
        password: {
          value: req.body.password
        }
      };

      if (error instanceof Error && error.message === 'Email ou senha incorretos') {
        return res.renderTemplate(
          signInForm({
            ...signInFormData,
            error: error.message
          })
        );
      }

      return res.renderTemplate(
        signInForm({
          ...signInFormData,
          error: 'Erro desconhecido ao logar'
        })
      );
    }
  });

usersController.get('/sign-up',
  userUnauthenticated,
  (req, res) => {
    return res.renderTemplate(
      layout({
        body: signUpPage()
      })
    );
  });

usersController.post('/sign-up',
  userUnauthenticated,
  async (req, res) => {
    try {
      const data = authRequestSchema.parse(req.body);
      const user = await signUp(data);
      req.session.user = user;
      res.setHeader('HX-Redirect', '/news').end();

      try {
        await createExampleProfile(user.id);
      } catch {}

      return;
    } catch (error) {
      const signUpFormData = {
        email: {
          value: req.body.email
        },
        password: {
          value: req.body.password
        },
        confirmPassword: {
          value: req.body.password
        }
      };
      if (error instanceof Error && error.message === 'Email já cadastrado') {
        return res.renderTemplate(
          signUpForm({
            ...signUpFormData,
            error: error.message,
            email: {
              ...signUpFormData.email,
              error: error.message
            }
          })
        );
      }

      return res.renderTemplate(
        signUpForm({
          ...signUpFormData,
          error: 'Erro desconhecido ao cadastrar'
        })
      );
    }
  });

usersController.post('/sign-up/email',
  async (req, res) => {
    const validation = emailSchema.safeParse(req.body.email);

    let error: string | undefined;
    let email = String(req.body.email);

    if (validation.success) {
      email = validation.data;
      const emailIsAvailable = await emailAvailable(email);

      if (!emailIsAvailable) {
        error = 'Email já cadastrado';
      }
    } else {
      error = validation.error.errors[0].message;
    }

    return res.renderTemplate(signUpForm.email(email, error));
  });

usersController.get('/sign-out',
  (req, res) => {
    req.session.destroy(() => {
      return res.redirect('/users/sign-in');
    });
  });

usersController.get('/forgot-password',
  (req, res) => {
    return res.renderTemplate(
      layout({
        body: forgotPassword()
      })
    );
  }
);

usersController.post('/forgot-password',
  async (req, res) => {
    try {
      const data = authRequestSchema.pick({
        email: true
      }).parse(req.body);
      await sendPasswordRecoveryEmail(data.email);
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      return res.renderTemplate(
        layout({
          body: recoveryEmailSent()
        })
      );
    }
  }
);

usersController.get('/password-recovery/:token',
  async (req, res) => {
    try {
      const token = req.params.token;

      const tokenIsValid = await isTokenValid(token);

      if (!tokenIsValid) {
        return res.redirect('/users/forgot-password');
      }

      return res.renderTemplate(
        layout({
          body: passwordRecoveryPage(req.params.token)
        })
      );
    } catch (error) {
      logger.error(error);
      return res.redirect('/users/forgot-password');
    }
  }
);

usersController.post('/password-recovery',
  async (req, res) => {
    try {
      const data = passwordRecoveryRequestSchema.parse(req.body);
      await recoverPassword({ token: data.token, password: data.password });
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      return res.redirect('/users/sign-in');
    }
  }
);
