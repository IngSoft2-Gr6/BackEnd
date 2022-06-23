import { User } from "@models/User.model";
import { Role } from "@models/Role.model";
import { responseJson } from "@helpers/response";
import { sendMail } from "@services/mail.service";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ms from "ms";
import until from "@helpers/until";
import { addMilliseconds } from "date-and-time";

const {
	JWT_SECRET,
	USER_TOKEN_EXPIRATION_TIME,
	FRONT_URL,
	MAIL_TOKEN_EXPIRATION_TIME,
} = process.env as {
	[key: string]: string;
};

export const getAllUsers = async (_req: any, res: any) => {
	// TODO: Add pagination
	const [err, users] = await until(User.findAll({ include: [{ all: true }] }));
	if (err) return responseJson(res, 500, err.message);
	if (!users) return responseJson(res, 204, "No users found");
	return responseJson(res, 200, "User retrieved successfully", users);
};

export const signup = async (req: any, res: any) => {
	const userAtt = { ...req.body, roleId: undefined };
	const roleId: number = req.body.roleId;

	// Hash password
	const salt = await bcrypt.genSalt();
	userAtt.password = await bcrypt.hash(userAtt.password, salt);

	// Create user
	let [err, user] = await until(User.create(userAtt, { include: [Role] }));
	if (err) return responseJson(res, 500, err.message);
	if (!user) return responseJson(res, 400, "User not created");

	// Add role
	const [err2, _role] = await until(user.$add("role", roleId));
	if (err2) return responseJson(res, 500, err2.message);

	// Create token with user id
	const token = jwt.sign({ id: user.id }, JWT_SECRET, {
		expiresIn: MAIL_TOKEN_EXPIRATION_TIME,
	});

	// Send mail for verification
	console.log("User created successfully", "Sending email");
	if (!user.email) return responseJson(res, 400, "User email not found");

	const [err3, mail] = await until(
		sendMail({
			to: user.email,
			subject: "Account verification",
			placeholders: {
				userName: user.name.split(" ")[0],
				url: `${FRONT_URL}/users/verify/account?token=${token}`,
			},
		})
	);
	if (err3) return responseJson(res, 500, err3.message);
	if (!mail) return responseJson(res, 400, "Mail not sent");

	return responseJson(res, 201, "User created successfully", user);
};

export const verifyAccount = async (req: any, res: any) => {
	const { token } = req.body;
	if (!token) return responseJson(res, 400, "Token not provided");

	// TODO: Add error handling
	const decoded = jwt.verify(token, JWT_SECRET) as any;
	if (!decoded) return responseJson(res, 400, "Invalid token");

	// Find user
	const [err, user] = await until(User.findByPk(decoded.id));
	if (err) return responseJson(res, 500, "Error retrieving user");
	if (!user) return responseJson(res, 400, "User not found");

	// Update user
	const [err2, _updated] = await until(user.update({ verified: true }));
	if (err2) return responseJson(res, 500, "Error updating user");

	return responseJson(res, 200, "User verified successfully");
};

export const login = async (req: any, res: any) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return responseJson(res, 400, "Email or password not provided");
	}

	const [err, user] = await until(
		User.findOne({ where: { email: (email as string).trim() } })
	);
	if (err) return responseJson(res, 500, err.message);
	if (!user) return responseJson(res, 404, "User not found");
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) return responseJson(res, 401, "Invalid credentials");

	// Expiration time between the token and cookie might differ by a few milliseconds
	const expires = addMilliseconds(new Date(), ms(USER_TOKEN_EXPIRATION_TIME));

	const token = jwt.sign({ id: user.id }, JWT_SECRET, {
		expiresIn: USER_TOKEN_EXPIRATION_TIME,
	});

	res.cookie("token", token, { httpOnly: true, expires });
	return responseJson(res, 200, "User logged in successfully", {
		...user,
		expires,
	});
};

export const resetPassword = async (req: any, res: any) => {
	const { password, token } = req.body;
	if (!password) return responseJson(res, 400, "Password not provided");
	if (!token) return responseJson(res, 400, "Token not provided");

	// verify token
	const decoded = jwt.verify(token, JWT_SECRET) as any;
	if (!decoded) return responseJson(res, 400, "Invalid token");

	const [err, user] = await until(User.findOne({ where: { id: decoded.id } }));
	if (err) return responseJson(res, 500, err.message);
	if (!user) return responseJson(res, 404, "User not found");

	// Hash password
	const salt = await bcrypt.genSalt();
	const hashedPassword = await bcrypt.hash(password, salt);

	// Update user
	const [err2, _updated] = await until(
		user.update({ password: hashedPassword })
	);
	if (err2) return responseJson(res, 500, err2.message);

	return responseJson(res, 200, "Password updated successfully");
};

export const recover = async (req: any, res: any) => {
	const { email } = req.body;
	if (!email) return responseJson(res, 400, "Email not provided");

	// Find user
	const [err, user] = await until(User.findOne({ where: { email } }));
	if (err) return responseJson(res, 500, err.message);
	if (!user) return responseJson(res, 404, "User not found");

	// Create token with user id
	const token = jwt.sign({ id: user.id }, JWT_SECRET, {
		expiresIn: MAIL_TOKEN_EXPIRATION_TIME,
	});

	// Send mail for verification
	const [err2, mail] = await until(
		sendMail({
			to: user.email,
			subject: "Password recovery",
			placeholders: {
				userName: user.name.split(" ")[0],
				url: `${FRONT_URL}/users/password/reset?token=${token}`,
			},
		})
	);

	if (err2) return responseJson(res, 500, err2.message);
	if (!mail) return responseJson(res, 400, "Mail not sent");

	return responseJson(res, 200, "Mail sent successfully");
};

export const getUser = async (req: any, res: any) => {
	// Make sure userInfo middleware is run before this
	return responseJson(res, 200, "User retrieved successfully", res.locals.user);
};

export const updateUser = async (req: any, res: any) => {
	const newUserInfo = { ...req.body, roleId: undefined };

	let roleId: number | number[] = req.body.roleId;

	// Make sure userInfo middleware is run before this
	const userFound = res.locals.user as User;

	const [err2, userUpdated] = await until(userFound.update(newUserInfo));
	if (err2) return responseJson(res, 500, err2.message);
	if (!userUpdated) return responseJson(res, 400, "User not updated");

	if (roleId) {
		// if roleId is not an array, make it an array
		if (!Array.isArray(roleId)) roleId = [roleId];
		const [err3, roles] = await until(userFound.$get("roles"));
		if (err3) return responseJson(res, 500, err3.message);
		if (!roles) return responseJson(res, 404, "Roles not found");

		const [err4, rolesToRemove] = await until(
			userFound.$remove("roles", roles, { force: true })
		);
		if (err4) return responseJson(res, 500, err4.message);
		if (!rolesToRemove) return responseJson(res, 400, "Roles not removed");

		const [err5, rolesToAdd] = await until(userFound.$add("roles", roleId));
		if (err5) return responseJson(res, 500, err5.message);
		if (!rolesToAdd) return responseJson(res, 400, "Roles not added");
	}

	return responseJson(res, 200, "User updated successfully", userUpdated);
};

export const deleteUser = async (req: any, res: any) => {
	const user = res.locals.user as User;

	// Verified should be set to false
	const [errorUpdating, userUpdated] = await until(
		user.update({ verified: false })
	);

	if (errorUpdating) return responseJson(res, 500, errorUpdating.message);
	if (!userUpdated) {
		return responseJson(res, 400, "User could not be deactivated");
	}

	const [errorDeleting, userDeleted] = await until(userUpdated.destroy());

	if (errorDeleting) return responseJson(res, 500, errorDeleting.message);
	if (!userDeleted) return responseJson(res, 400, "User not deleted");

	// No further information, deleted successfully
	return responseJson(res, 204);
};
