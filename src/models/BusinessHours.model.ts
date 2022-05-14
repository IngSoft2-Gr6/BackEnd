import {
	ForeignKey,
	Column,
	Model,
	Table,
	DataType,
	AllowNull,
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
export interface BusinessHoursPatchAttributes
	extends Partial<BusinessHoursAttributes> {}

@Table
export class BusinessHours extends Model<
	BusinessHoursAttributes,
	BusinessHoursAddAttributes
> {
	@ForeignKey(() => ParkingLot)
	parkingLotId!: string;

	@AllowNull(false)
	@Column({ type: DataType.INTEGER, validate: { min: 1, max: 7 } })
	day!: number;

	@AllowNull(false)
	@Column(DataType.TIME)
	openTime!: Date;

	@AllowNull(false)
	@Column(DataType.TIME)
	closeTime!: Date;
}
