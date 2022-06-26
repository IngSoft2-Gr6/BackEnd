import {
	Table,
	Model,
	Column,
	BelongsToMany,
	ForeignKey,
	HasMany,
	DataType,
	AllowNull,
} from "sequelize-typescript";

import { User } from "./User.model";
import { EmployeeParkingLot } from "./EmployeeParkingLot.model";
import { BusinessHours } from "./BusinessHours.model";
import { Rating } from "./Rating.model";
import { ParkingHistory } from "./ParkingHistory.model";

export interface ParkingLotAttributes {
	id: number;
	name: string;
	description?: string;
	address: string;
	coords: Array<number>;
	fee: number;
	feePer: "minute" | "hour";
	minFee?: number;
	capacity: number;
	keyNeeded: boolean;
	ownerId: string;
}
export interface ParkingLotAddAttributes
	extends Omit<ParkingLotAttributes, "id"> {}
export interface ParkingLotPatchAttributes
	extends Partial<ParkingLotAttributes> {}

@Table
export class ParkingLot extends Model<
	ParkingLotAttributes,
	ParkingLotAddAttributes
> {
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	id!: string;

	@AllowNull(false)
	@Column
	name!: string;

	@Column(DataType.TEXT)
	description?: string;

	@AllowNull(false)
	@Column
	address!: string;

	// TODO: Change to a coordinate object
	@AllowNull(false)
	@Column(DataType.ARRAY(DataType.DECIMAL))
	coords!: Array<number>;

	@AllowNull(false)
	@Column(DataType.DOUBLE)
	fee!: number;

	@AllowNull(false)
	@Column(DataType.ENUM("minute", "hour"))
	feePer!: string;

	@Column({ defaultValue: 0, type: DataType.DOUBLE })
	minFee!: number;

	@AllowNull(false)
	@Column
	capacity!: number;

	@AllowNull(false)
	@Column
	keyNeeded!: boolean;

	@ForeignKey(() => User)
	ownerId!: string;

	@BelongsToMany(() => User, () => EmployeeParkingLot)
	employees!: Array<User & { EmployeeParkingLot: EmployeeParkingLot }>;

	@BelongsToMany(() => User, () => Rating)
	ratingParkingLot!: Array<User & { Rating: Rating }>;

	@HasMany(() => ParkingHistory)
	parkingHistory!: Array<ParkingHistory>;

	@HasMany(() => BusinessHours)
	businessHours!: Array<BusinessHours>;
}
