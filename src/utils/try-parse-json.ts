import { GenericJson } from "../infra/http/www/templates/components/batch-analyser";

export function tryParseJson(data: any, fallbackValue: any = null): GenericJson | null {
	try {
		return JSON.parse(data);
	} catch (_) {
		return fallbackValue;
	}
}
