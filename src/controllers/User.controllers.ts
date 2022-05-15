import { User } from "@models/User.model";
import { Role } from "@models/Role.model";
import { UserAddAttributes } from "@models/User.model";
import { responseJson, controllerWrapper } from "@helpers/controller.helpers";
import bcrypt from "bcrypt";

export const getAllUsers = controllerWrapper(async (_req: any, res: any) => {
	const user = await User.findAll({ include: [{ model: Role }] });
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
	return responseJson(res, 200, "User logged in successfully", user);
});

export const getUser = controllerWrapper(async (req: any, res: any) => {
	const user = await User.findByPk(req.params.id, {
		include: [{ model: Role }],
	});
	if (!user) return responseJson(res, 404, "User not found", null);
	return responseJson(res, 200, "User retrieved successfully", user);
});

export const updateUser = controllerWrapper(async (req: any, res: any) => {
	const userId: string = req.params.id;
	const user: Partial<UserAddAttributes> = { ...req.body, roleId: undefined };
	let roleId: number | number[] = req.body.roleId;

	const userToUpdate = await User.findByPk(userId);
	if (!userToUpdate) return responseJson(res, 404, "User not found", null);

	const updatedUser = await userToUpdate.update(user);

	if (roleId) {
		// if roleId is not an array, make it an array
		if (!Array.isArray(roleId)) roleId = [roleId];

		const userRoles = await userToUpdate.$get("roles");

		// remove roles that are not in the roleId array
		for (const userRole of userRoles) {
			if (!roleId.includes(userRole.id)) {
				await userToUpdate.$remove("role", userRole.id, { force: true });
			}
		}

		// for each role if not exist add it
		for (const role of roleId) {
			if (!(await userToUpdate.$has("role", role))) {
				await userToUpdate.$add("role", role);
			}
		}
	}

	return responseJson(res, 200, "User updated successfully", updatedUser);
});

export const deleteUser = controllerWrapper(async (req: any, res: any) => {
	const userId: string = req.params.id;
	const user = await User.findByPk(userId);
	if (!user) return responseJson(res, 404, "User not found", null);
	await user.destroy();
	return responseJson(res, 200, "User deleted successfully", null);
});
