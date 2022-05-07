import {
	Table,
	Model,
	Column,
	ForeignKey,
	DataType,
	Default,
	PrimaryKey,
} from "sequelize-typescript";

import { ParkingLot } from "./ParkingLot.model";
import { Vehicle } from "./Vehicle.model";

export interface ParkingHistoryAttributes {
	id: string;
	parkingLotTd: string;
	vehicleId: string;
	bookingStartTime?: Date;
	bookingEndTime?: Date;
	parkingStartTime?: Date;
	parkingEndTime?: Date;
	paidAmount: number;
	metadata: any;
}
export interface ParkingHistoryAddAttributes
	extends Omit<ParkingHistoryAttributes, "id"> {}

@Table
export class ParkingHistory extends Model<
	ParkingHistoryAttributes,
	ParkingHistoryAddAttributes
> {
	@PrimaryKey
	@Default(DataType.UUIDV4)
	@Column(DataType.UUID)
	id!: string;

	@ForeignKey(() => ParkingLot)
	parkingLotId!: string;

	@ForeignKey(() => Vehicle)
	vehicleId!: string;

	@Column
	bookingStartTime?: Date;

	@Column
	bookingEndTime?: Date;

	@Column
	parkingStartTime?: Date;

	@Column
	parkingEndTime?: Date;

	@Column({ defaultValue: 0, type: DataType.DOUBLE })
	paidAmount?: number;

	@Column({ defaultValue: {}, type: DataType.JSON })
	metadata!: any;
}
