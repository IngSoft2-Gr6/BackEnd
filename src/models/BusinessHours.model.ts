import {
	ForeignKey,
	Column,
	Model,
	Table,
	DataType,
} from "sequelize-typescript";
import { ParkingLot } from "./ParkingLot.model";

export interface BusinessHoursAttributes {
	id: number;
	parkingLotID: string;
	day: number;
	openTime: Date;
	closeTime: Date;
}
export interface BusinessHoursAddAttributes
	extends Omit<BusinessHoursAttributes, "id"> {}

@Table
export class BusinessHours extends Model<
	BusinessHoursAttributes,
	BusinessHoursAddAttributes
> {
	@ForeignKey(() => ParkingLot)
	parkingLotId!: string;

	@Column({ type: DataType.INTEGER, validate: { min: 1, max: 7 } })
	day!: number;

	@Column(DataType.TIME)
	openTime!: Date;

	@Column(DataType.TIME)
	closeTime!: Date;
}
