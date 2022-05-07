import {
	Table,
	Model,
	Column,
	ForeignKey,
	DataType,
	HasMany,
} from "sequelize-typescript";
import { ParkingHistory } from "./ParkingHistory.model";

import { User } from "./User.model";
import { VehicleType } from "./VehicleType.model";

export interface VehicleAttributes {
	id: string; // uuidv4
	driverId?: string; // uuidv4
	vehicleTypeId: number;
	plate: string;
	color?: string;
	brand?: string;
	model?: string;
	year?: number;
}

export interface VehicleAddAttributes extends Omit<VehicleAttributes, "id"> {}

@Table
export class Vehicle extends Model<VehicleAttributes, VehicleAddAttributes> {
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	id!: string;

	@ForeignKey(() => User)
	driverId!: string;

	@ForeignKey(() => VehicleType)
	vehicleTypeId!: number;

	@Column
	plate!: string;

	@Column
	color?: string;

	@Column
	brand?: string;

	@Column
	model?: string;

	@Column
	year?: number;

	@HasMany(() => ParkingHistory)
	parkingHistories!: Array<ParkingHistory>;
}
