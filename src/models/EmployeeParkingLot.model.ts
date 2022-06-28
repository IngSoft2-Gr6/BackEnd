import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { ParkingLot } from "./ParkingLot.model";
import { User } from "./User.model";

export interface EmployeeParkingLotAttributes {
	employeeId: string;
	parkingLotId: string;
}
export interface EmployeeParkingLotAddAttributes
	extends EmployeeParkingLotAttributes {}

@Table
export class EmployeeParkingLot extends Model<
	EmployeeParkingLotAttributes,
	EmployeeParkingLotAddAttributes
> {
	@ForeignKey(() => User)
	employeeId!: string;

	@ForeignKey(() => ParkingLot)
	parkingLotId!: string;
}
