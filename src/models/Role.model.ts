import { BelongsToMany, Column, Model, Table } from "sequelize-typescript";
import { User } from "./User.model";
import { UserRole } from "./UserRole.model";

export interface RoleAttributes {
	id: number;
	name: string;
}
export interface RoleAddAttributes extends Omit<RoleAttributes, "id"> {}

@Table
export class Role extends Model<RoleAttributes, RoleAddAttributes> {
	@Column
	name!: string;

	@BelongsToMany(() => User, () => UserRole)
	users!: Array<User & { UserRole: UserRole }>;
}
