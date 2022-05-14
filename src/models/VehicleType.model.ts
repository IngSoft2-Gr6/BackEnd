import { HasMany, Column, Model, Table, AllowNull } from "sequelize-typescript";
import { Vehicle } from "./Vehicle.model";

export interface VehicleTypeAttributes {
	id: number;
	name: string;
}
export interface VehicleTypeAddAttributes
	extends Omit<VehicleTypeAttributes, "id"> {}
export interface VehicleTypePatchAttributes
	extends Partial<VehicleTypeAttributes> {}

@Table
export class VehicleType extends Model<
	VehicleTypeAttributes,
	VehicleTypeAddAttributes
> {
	@AllowNull(false)
	@Column
	name!: string;

	@HasMany(() => Vehicle)
	vehicles!: Array<Vehicle>;
}
