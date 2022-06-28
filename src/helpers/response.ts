export const responseJson = (
	res: any,
	status: number,
	message?: string,
	data: any = null
) => {
	// TODO: Add warnings to response
	res.status(status).json({ message, data });
};
