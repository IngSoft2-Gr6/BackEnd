import { HasMany, Column, Model, Table } from "sequelize-typescript";
import { Vehicle } from "./Vehicle.model";

export interface VehicleTypeAttributes {
	id: number;
	name: string;
}
export interface VehicleTypeAddAttributes
	extends Omit<VehicleTypeAttributes, "id"> {}

@Table
export class VehicleType extends Model<
	VehicleTypeAttributes,
	VehicleTypeAddAttributes
> {
	@Column
	name!: string;

	@HasMany(() => Vehicle)
	vehicles!: Array<Vehicle>;
}
