import {
	ForeignKey,
	Column,
	Model,
	Table,
	DataType,
	AllowNull,
	PrimaryKey,
} from "sequelize-typescript";
import { ParkingLot } from "./ParkingLot.model";

export const TimeFormat = "HH:mm:ss";

export interface BusinessHoursAttributes {
	parkingLotId: string;
	day: number;
	openTime: string;
	closeTime: string;
}
export interface BusinessHoursAddAttributes extends BusinessHoursAttributes {}
export interface BusinessHoursPatchAttributes
	extends Partial<BusinessHoursAttributes> {}

@Table({
	// remove paranoid mode for this table
	paranoid: false,
})
export class BusinessHours extends Model<
	BusinessHoursAttributes,
	BusinessHoursAddAttributes
> {
	@PrimaryKey
	@ForeignKey(() => ParkingLot)
	@Column({ type: DataType.UUID })
	parkingLotId!: string;

	@PrimaryKey
	@Column({ type: DataType.INTEGER, validate: { min: 1, max: 7 } })
	day!: number;

	@AllowNull(false)
	@Column(DataType.TIME)
	openTime!: string;

	@AllowNull(false)
	@Column(DataType.TIME)
	closeTime!: string;
}
