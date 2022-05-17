export const responseJson = (
	res: any,
	status: number,
	message: string,
	data: any = null
) => {
	const success = status >= 200 && status < 300;
	res.status(status).json({
		success,
		message,
		data,
	});
};
