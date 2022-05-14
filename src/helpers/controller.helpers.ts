export const responseJson = (
	res: any,
	status: number,
	message: string,
	data: any
) => {
	const success = status >= 200 && status < 300;
	res.status(status).json({
		success,
		message,
		data,
	});
};

export const controllerWrapper = (func: any) => {
	return async (req: any, res: any, next?: any) => {
		try {
			await func(req, res, next);
		} catch (error: any) {
			return responseJson(res, 500, error.message, error);
		}
	};
};
