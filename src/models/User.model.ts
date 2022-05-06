import {
	Table,
	Model,
	Column,
	BelongsToMany,
	ForeignKey,
	HasMany,
} from "sequelize-typescript";

import { Role } from "./Role.model";
import { UserRole } from "./UserRole.model";
import { IdentityCardType } from "./IdentityCardType.model";
import { Vehicle } from "./Vehicle.model";

export interface UserAttributes {
	id: number; // TODO: change to uuidv4
	name: string;
	identityCard: string;
	identityCardType: number;
	email: string;
	password: string;
	phone?: string;
	photo?: string;
}
export interface UserAddAttributes extends Omit<UserAttributes, "id"> {}

@Table
export class User extends Model<UserAttributes, UserAddAttributes> {
	@Column
	name!: string;

	@Column
	identityCard!: string;

	@ForeignKey(() => IdentityCardType)
	identityCardType!: number;

	@Column
	email!: string;

	@Column
	password?: string;

	@Column
	phone?: string;

	@BelongsToMany(() => Role, () => UserRole)
	roles!: Array<Role & { UserRole: UserRole }>;

	@HasMany(() => Vehicle)
	vehicles!: Vehicle[];
}
