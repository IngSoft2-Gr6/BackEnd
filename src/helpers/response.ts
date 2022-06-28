export const responseJson = (
	res: any,
	status: number,
	message: string,
	data: any = null
) => {
	res.status(status).json({ message, data });
};
