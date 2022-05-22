import jwt from "jsonwebtoken";
import { responseJson } from "@helpers/response";

export const verifyToken = (req: any, res: any, next: any) => {
	const token = req.cookies.token;
	if (!token) return responseJson(res, 401, "No token provided", null);
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
		req.decoded = decoded;
		next();
	} catch (err) {
		res.clearCookie("token");
		return responseJson(res, 401, "Invalid token", null);
	}
};
