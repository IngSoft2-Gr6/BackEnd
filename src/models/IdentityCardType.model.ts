import { AllowNull, Column, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "./User.model";

export interface IdentityCardTypeAttributes {
	id: number;
	name: string;
}
export interface IdentityCardTypeAddAttributes
	extends Omit<IdentityCardTypeAttributes, "id"> {}
export interface IdentityCardTypePatchAttributes
	extends Partial<IdentityCardTypeAttributes> {}

@Table
export class IdentityCardType extends Model<
	IdentityCardTypeAttributes,
	IdentityCardTypeAddAttributes
> {
	@AllowNull(false)
	@Column
	name!: string;

	@HasMany(() => User)
	users!: Array<User>;
}
