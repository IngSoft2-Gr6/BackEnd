import { User } from "@models/User.model";
import { Role } from "@models/Role.model";
import { UserAddAttributes, UserPatchAttributes } from "@models/User.model";
import { responseJson } from "@helpers/response.helpers";
import { controllerWrapper } from "@helpers/controller.helpers";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getAllUsers = controllerWrapper(async (_req: any, res: any) => {
	// TODO: Add pagination
	const user = await User.findAll({ include: [{ model: Role }] });
	if (!user) return responseJson(res, 204, "No users found");
	return responseJson(res, 200, "User retrieved successfully", user);
});

export const register = controllerWrapper(async (req: any, res: any) => {
	const userAtt: UserAddAttributes = { ...req.body, roleId: undefined };
	const salt = await bcrypt.genSalt(10);
	userAtt.password = await bcrypt.hash(userAtt.password, salt);
	const roleId: number = req.body.roleId;
	const user = await User.create(userAtt, { include: [{ model: Role }] });
	await user.$add("role", roleId);
	return responseJson(res, 201, "User created successfully", user);
});

export const login = controllerWrapper(async (req: any, res: any) => {
	const { email, password } = req.body;
	const user = await User.findOne({ where: { email } });
	if (!user) return responseJson(res, 404, "User not found", null);
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) return responseJson(res, 401, "Invalid credentials", null);

	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "", {
		expiresIn: "5s", // expires in 5 seconds for testing
	});
	res.cookie("token", token, { httpOnly: true });
	return responseJson(res, 200, "User logged in successfully", user);
});

export const getUser = controllerWrapper(async (req: any, res: any) => {
	const userId: string = req.params.id || req.decoded.id;
	if (!userId) return responseJson(res, 400, "No user id provided", null);

	const user = await User.findByPk(userId, { include: [Role] });
	if (!user) return responseJson(res, 404, "User not found", null);

	return responseJson(res, 200, "User retrieved successfully", user);
});

export const updateUser = controllerWrapper(async (req: any, res: any) => {
	const userId: string = req.params.id || req.decoded.id;
	const user: UserPatchAttributes = { ...req.body, roleId: undefined };
	let roleId: number | number[] = req.body.roleId;

	const userToUpdate = await User.findByPk(userId);
	if (!userToUpdate) return responseJson(res, 404, "User not found", null);

	const updatedUser = await userToUpdate.update(user);

	if (roleId) {
		// if roleId is not an array, make it an array
		if (!Array.isArray(roleId)) roleId = [roleId];
		const userRoles = await userToUpdate.$get("roles");

		await userToUpdate.$remove("roles", userRoles, { force: true });
		await userToUpdate.$add("roles", roleId);
	}

	return responseJson(res, 200, "User updated successfully", updatedUser);
});

export const deleteUser = controllerWrapper(async (req: any, res: any) => {
	const userId: string = req.params.id || req.decoded.id;
	const user = await User.findByPk(userId);
	if (!user) return responseJson(res, 404, "User not found", null);
	await user.destroy();
	return responseJson(res, 200, "User deleted successfully", null);
});
