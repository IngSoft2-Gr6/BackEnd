import { Column, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "./User.model";

export interface IdentityCardTypeAttributes {
	id: number;
	name: string;
}
export interface IdentityCardTypeAddAttributes
	extends Omit<IdentityCardTypeAttributes, "id"> {}

@Table
export class IdentityCardType extends Model<
	IdentityCardTypeAttributes,
	IdentityCardTypeAddAttributes
> {
	@Column
	name!: string;

	@HasMany(() => User)
	users!: User[];
}
