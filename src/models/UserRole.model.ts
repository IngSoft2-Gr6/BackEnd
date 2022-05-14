import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Role } from "./Role.model";
import { User } from "./User.model";

export interface UserRoleAttributes {
	userId: string;
	roleId: number;
}
export interface UserRoleAddAttributes extends UserRoleAttributes {}
export interface UserRolePatchAttributes extends Partial<UserRoleAttributes> {}

@Table
export class UserRole extends Model<UserRoleAttributes, UserRoleAddAttributes> {
	@ForeignKey(() => User)
	userId!: string;

	@ForeignKey(() => Role)
	roleId!: number;
}
