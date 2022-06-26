import { verifyToken } from "@middlewares/auth.middleware";
import { User } from "@models/User.model";
import { deleteUser } from "@controllers/User.controllers";
import { responseJson } from "@helpers/response";
import { subtract as subtractDate } from "date-and-time";

import until from "@helpers/until";
import ms from "ms";

const { USER_VERIFICATION_THRESHOLD_TIME } = process.env as {
	[key: string]: string;
};

export const getCurrentUserInfo = async (req: any, res: any, next: any) => {
	if (res.locals.user) return next();

	return verifyToken(req, res, async () => {
		const userId = res.locals.decoded.id;
		const [err, user] = await until(
			User.findByPk(userId, { include: [{ all: true }] })
		);

		if (err) return responseJson(res, 500, err.message);
		if (!user) return responseJson(res, 404, "User not found");

		res.locals.user = user;
		return next();
	});
};

export const getCurrentVerifiedUserInfo = async (
	req: any,
	res: any,
	next: any
) => {
	return getCurrentUserInfo(req, res, async () => {
		const user = res.locals.user as User;
		if (!user.verified) {
			const threshold_time_ms = ms(USER_VERIFICATION_THRESHOLD_TIME);

			// User might have created an account but not verified it yet
			const time_since_last_update = subtractDate(
				new Date(),
				user.updatedAt
			).toMilliseconds();

			if (time_since_last_update >= threshold_time_ms) {
				// This isn't a 410 because this could be temporary
				res.locals.overwriteResponse = {
					status: 404,
					message: "User not found",
				};

				// Response will be overwritten by the previous object
				return deleteUser(req, res);
			}
			//TODO: Add warning to response
			//TODO: Send email to user?
			return responseJson(res, 403, "User not verified");
		}

		next();
	});
};
