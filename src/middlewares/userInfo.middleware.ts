import { verifyToken } from "@middlewares/auth.middleware";
import { User } from "@models/User.model";
import { responseJson } from "@helpers/response";

import until from "@helpers/until";

export const getCurrentUserInfo = async (req: any, res: any, next: any) => {
	return verifyToken(req, res, async () => {
		const userId = res.locals.decoded.id;
		const [err, user] = await until(
			User.findByPk(userId, { include: [{ all: true }] })
		);

		if (err) return responseJson(res, 500, err.message);
		if (!user) return responseJson(res, 404, "User not found");

		res.locals.user = user;
		next();
	});
};