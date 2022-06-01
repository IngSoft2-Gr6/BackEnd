import { User } from "@models/User.model";
import { Role } from "@models/Role.model";
import { responseJson } from "@helpers/response";
import { sendMail } from "@services/mail.service";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import until from "@helpers/until";

export const getAllUsers = async (_req: any, res: any) => {
	// TODO: Add pagination
	const [err, users] = await until(User.findAll({ include: [Role] }));
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
	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "", {
		expiresIn: "1h",
	});

	// Send mail for verification
	console.log("User created successfully", "Sending email");
	if (!user.email) return responseJson(res, 400, "User email not found");
	const url = `${process.env.FRONT_URL}/users/verify/account?token=${token}`;

	const [err3, mail] = await until(
		//TODO: Add more information rather than just the url
		sendMail(user.email!.trim(), "Account verification", url)
	);
	if (err3) return responseJson(res, 500, err3.message);
	if (!mail) return responseJson(res, 400, "Mail not sent");

	return responseJson(res, 201, "User created successfully", user);
};

export const verifyAccount = async (req: any, res: any) => {
	const { token } = req.body;
	if (!token) return responseJson(res, 400, "Token not provided");

	const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as any;
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
	const [err, user] = await until(User.findOne({ where: { email } }));
	if (err) return responseJson(res, 500, err.message);
	if (!user) return responseJson(res, 404, "User not found");
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) return responseJson(res, 401, "Invalid credentials");

	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "", {
		expiresIn: "30s", // expires in 30 seconds for testing
	});
	res.cookie("token", token, { httpOnly: true });
	return responseJson(res, 200, "User logged in successfully", user);
};

export const resetPassword = async (req: any, res: any) => {
	const { password, token } = req.body;
	if (!password) return responseJson(res, 400, "Password not provided");
	if (!token) return responseJson(res, 400, "Token not provided");

	// verify token
	const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as any;
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
	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "", {
		expiresIn: "1h",
	});

	// Send mail for verification
	const url = `${process.env.FRONT_URL}/password/reset?token=${token}`;
	const [err2, mail] = await until(
		sendMail(user.email, "Password recovery", url)
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

	const [err, userDeleted] = await until(user.destroy());

	if (err) return responseJson(res, 500, err.message);
	if (!userDeleted) return responseJson(res, 400, "User not deleted");

	return responseJson(res, 200, "User deleted successfully", user);
};
