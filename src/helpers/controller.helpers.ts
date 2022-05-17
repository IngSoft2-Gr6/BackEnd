import { responseJson } from "@helpers/response.helpers";

export const controllerWrapper = (func: any) => {
	return async (req: any, res: any, next?: any) => {
		try {
			await func(req, res, next);
		} catch (error: any) {
			return responseJson(res, 500, error.message, error);
		}
	};
};
