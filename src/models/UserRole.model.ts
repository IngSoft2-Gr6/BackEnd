import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Role } from "./Role.model";
import { User } from "./User.model";

export interface UserRoleAttributes {
	userId: number;
	roleId: number;
}
export interface UserRoleAddAttributes extends UserRoleAttributes {}

@Table
export class UserRole extends Model<UserRoleAttributes, UserRoleAddAttributes> {
	@Column
	info!: string;

	@ForeignKey(() => User)
	@Column
	userId!: number;

	@ForeignKey(() => Role)
	@Column
	roleId!: number;
}
