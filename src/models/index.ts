import Sequelize from "sequelize";
import sequelize from "@configs/database";

import { User } from "./User.model";
import { Role } from "./Role.model";
import { UserRole } from "./UserRole.model";
import { IdentityCardType } from "./IdentityCardType.model";
import { Vehicle } from "./Vehicle.model";
import { VehicleType } from "./VehicleType.model";

// add models
const Models = { User, Role, UserRole, IdentityCardType, Vehicle, VehicleType };
sequelize.addModels(Object.values(Models));
const db = { sequelize, Sequelize, Models };

db.sequelize
	.sync({ force: process.env.NODE_ENV === "development" })
	.then(async () => {
		console.log("Database & tables created!");

		// create roles
		await db.Models.Role.bulkCreate([
			{ name: "admin" },
			{ name: "driver" },
			{ name: "owner" },
			{ name: "employee" },
		]);
	})
	.catch((err) => console.log("Unable to connect to the database:", err));

export default db;
