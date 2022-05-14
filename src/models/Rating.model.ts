import {
	ForeignKey,
	Column,
	Model,
	Table,
	DataType,
} from "sequelize-typescript";
import { ParkingLot } from "./ParkingLot.model";
import { User } from "./User.model";

export interface RatingAttributes {
	driverId: string;
	parkingLotID: string;
	commentParkingLot?: string;
	commentDriver?: string;
	ratingParkingLot?: number;
	ratingDriver?: number;
}
export interface RatingAddAttributes extends RatingAttributes {}
export interface RatingPatchAttributes extends Partial<RatingAttributes> {}

@Table
export class Rating extends Model<RatingAttributes, RatingAddAttributes> {
	@ForeignKey(() => User)
	driverId!: string;

	@ForeignKey(() => ParkingLot)
	parkingLotId!: string;

	@Column(DataType.TEXT)
	commentParkingLot?: string;

	@Column(DataType.TEXT)
	commentDriver?: string;

	@Column(DataType.FLOAT)
	ratingParkingLot?: number;

	@Column(DataType.FLOAT)
	ratingdriver?: number;
}
