import {
	AllowNull,
	BelongsToMany,
	Column,
	Model,
	Table,
} from "sequelize-typescript";
import { User } from "./User.model";
import { UserRole } from "./UserRole.model";

export interface RoleAttributes {
	id: number;
	name: string;
}
export interface RoleAddAttributes extends Omit<RoleAttributes, "id"> {}
export interface RolePatchAttributes extends Partial<RoleAttributes> {}

@Table
export class Role extends Model<RoleAttributes, RoleAddAttributes> {
	@AllowNull(false)
	@Column
	name!: string;

	@BelongsToMany(() => User, () => UserRole)
	users!: Array<User & { UserRole: UserRole }>;
}
