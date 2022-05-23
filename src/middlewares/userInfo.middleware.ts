import { verifyToken } from "@middlewares/auth.middleware";
import { User } from "@models/User.model";
import { Role } from "@models/Role.model";
import { IdentityCardType } from "@models/IdentityCardType.model";
import { responseJson } from "@helpers/response";

import until from "@helpers/until";

export const getUserInfo = async (req: any, res: any, next: any) => {
	return verifyToken(req, res, async () => {
		const userId = res.locals.decoded.id;
		const [err, user] = await until(
			User.findByPk(userId, { include: [Role, IdentityCardType] })
		);

		if (err) return responseJson(res, 500, err.message);
		if (!user) return responseJson(res, 404, "User not found");

		res.locals.user = user;
		next();
	});
};
