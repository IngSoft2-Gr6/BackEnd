import {
	Table,
	Model,
	Column,
	BelongsToMany,
	ForeignKey,
	HasMany,
	DataType,
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
	capacity: number;
	keyNeeded: boolean;
	ownerId: number;
}
export interface ParkingLotAddAttributes
	extends Omit<ParkingLotAttributes, "id"> {}

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

	@Column
	name!: string;

	@Column(DataType.TEXT)
	description?: string;

	@Column
	address!: string;

	// TODO: Change to a coordinate object
	@Column(DataType.ARRAY(DataType.DECIMAL))
	coords!: Array<number>;

	@Column(DataType.DOUBLE)
	fee!: number;

	@Column
	capacity!: number;

	@Column
	keyNeeded!: boolean;

	@ForeignKey(() => User)
	ownerId!: string;

	@BelongsToMany(() => User, () => EmployeeParkingLot)
	Employees!: Array<User & { EmployeeParkingLot: EmployeeParkingLot }>;

	@BelongsToMany(() => User, () => Rating)
	RatingParkingLot!: Array<User & { Rating: Rating }>;

	@HasMany(() => ParkingHistory)
	ParkingHistories!: Array<ParkingHistory>;

	@HasMany(() => BusinessHours)
	businessHours!: Array<BusinessHours>;
}
