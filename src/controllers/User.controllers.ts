import { User } from "@models/User.model";
import { Role } from "@models/Role.model";
import { UserAddAttributes } from "@models/User.model";

export const getAllUsers = async (req: any, res: any) => {
	try {
		const users = await User.findAll({ include: [{ model: Role }] });
		return res.status(200).json({
			success: true,
			message: "Users retrieved successfully",
			data: users,
		});
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: error.message,
			data: error,
		});
	}
};

export const createUser = async (req: any, res: any) => {
	try {
		const userAtt: UserAddAttributes = { ...req.body, roleId: undefined };
		const roleId: number = req.body.roleId;
		const user = await User.create(userAtt);
		await user.$add("role", roleId);
		return res.status(201).json({
			success: true,
			message: "User created successfully",
			data: user,
		});
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: error.message,
			data: error,
		});
	}
};

export const getUser = async (req: any, res: any) => {
	try {
		const user = await User.findByPk(req.params.id, {
			include: [{ model: Role }],
		});
		if (!user) throw new Error("User not found");
		return res.status(200).json({
			success: true,
			message: "User retrieved successfully",
			data: user,
		});
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: error.message,
			data: error,
		});
	}
};

export const updateUser = async (req: any, res: any) => {
	try {
		const userId: string = req.params.id;
		const user: Partial<UserAddAttributes> = { ...req.body, roleId: undefined };
		const roleId: number = req.body.roleId;

		// update user there is only one user with this id
		const [count, updatedUsers] = await User.update(user, {
			where: { id: userId },
			returning: true,
			individualHooks: true,
		});
		if (count === 0) throw new Error("User not found");
		if (count > 1) throw new Error("More than one user with this id"); // should never happen
		if (roleId) await updatedUsers[0].$add("roles", roleId);

		return res.status(200).json({
			success: true,
			message: "User updated successfully",
			data: updatedUsers[0],
		});
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: error.message,
			data: error,
		});
	}
};

export const deleteUser = async (req: any, res: any) => {
	try {
		const userId: string = req.params.id;
		const user = await User.findByPk(userId);
		if (!user) throw new Error("User not found");
		await user.destroy();

		return res.status(200).json({
			success: true,
			message: "User deleted successfully",
			data: user,
		});
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: error.message,
			data: error,
		});
	}
};
