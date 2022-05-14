import Sequelize from "sequelize";
import sequelize from "@configs/database";

import { User } from "./User.model";
import { Role } from "./Role.model";
import { UserRole } from "./UserRole.model";
import { IdentityCardType } from "./IdentityCardType.model";
import { Vehicle } from "./Vehicle.model";
import { VehicleType } from "./VehicleType.model";
import { ParkingLot } from "./ParkingLot.model";
import { BusinessHours } from "./BusinessHours.model";
import { EmployeeParkingLot } from "./EmployeeParkingLot.model";
import { ParkingHistory } from "./ParkingHistory.model";
import { Rating } from "./Rating.model";

// add models
const Models = {
	User,
	Role,
	UserRole,
	IdentityCardType,
	Vehicle,
	VehicleType,
	ParkingLot,
	BusinessHours,
	EmployeeParkingLot,
	ParkingHistory,
	Rating,
};

sequelize.addModels(Object.values(Models));
const db = { sequelize, Sequelize, Models };

export default db;
