import {
	Table,
	Model,
	Column,
	BelongsToMany,
	ForeignKey,
	HasMany,
	DataType,
	Unique,
	AllowNull,
} from "sequelize-typescript";

import { Role } from "./Role.model";
import { UserRole } from "./UserRole.model";
import { IdentityCardType } from "./IdentityCardType.model";
import { ParkingLot } from "./ParkingLot.model";
import { EmployeeParkingLot } from "./EmployeeParkingLot.model";
import { Rating } from "./Rating.model";
import { Vehicle } from "./Vehicle.model";

export interface UserAttributes {
	id: string; // uuidv4
	name: string;
	identityCard: string;
	identityCardType: number;
	email: string;
	verified: boolean;
	password: string;
	phone?: string;
	photo?: string;
}
export interface UserAddAttributes extends Omit<UserAttributes, "id"> {}
export interface UserPatchAttributes extends Partial<UserAttributes> {}

@Table
export class User extends Model<UserAttributes, UserAddAttributes> {
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	id!: string;

	@AllowNull(false)
	@Column
	name!: string;

	@AllowNull(false)
	@Column
	identityCard!: string;

	@ForeignKey(() => IdentityCardType)
	identityCardType!: number;

	@AllowNull(false)
	@Unique
	@Column
	email!: string;

	@AllowNull(false)
	@Column
	password!: string;

	@Column
	phone?: string;

	@Column(DataType.TEXT)
	photo?: string;

	@AllowNull(false)
	@Column({ defaultValue: false })
	verified!: boolean;

	// User has many roles
	@BelongsToMany(() => Role, () => UserRole)
	roles!: Array<Role & { UserRole: UserRole }>;

	// Employee can work in multiple parking lots
	// FIXME: change property name
	@BelongsToMany(() => ParkingLot, () => EmployeeParkingLot)
	ParkingsLot!: Array<ParkingLot & { EmployeeParkingLot: EmployeeParkingLot }>;

	// User can rate many parking lots and can be rated by many parking lots
	@BelongsToMany(() => ParkingLot, () => Rating)
	RatingDriver!: Array<ParkingLot & { Rating: Rating }>;

	// Owner has many parking lots
	@HasMany(() => ParkingLot)
	ParkingLots!: Array<ParkingLot>;

	// Driver has many vehicles
	@HasMany(() => Vehicle)
	vehicles!: Array<Vehicle>;
}
