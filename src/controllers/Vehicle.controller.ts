import { responseJson } from "@helpers/response";
import { Vehicle, VehicleAddAttributes } from "@models/Vehicle.model";
import { User } from "@models/User.model";

import until from "@helpers/until";
import { ParkingHistory } from "@models/ParkingHistory.model";
import { Op } from "sequelize";

export const addVehicleByDriver = async (req: any, res: any) => {
	const user = res.locals.user as User;

	let vehicleAtt: VehicleAddAttributes = req.body;
	const roles = user.roles.map((role: any) => role.name);

	// if roles not includes nor employee nor driver, return error
	if (!roles.includes("Employee") && !roles.includes("Driver")) {
		return responseJson(res, 401, "Unauthorized");
	}

	// If user has role Driver, add userId as driverId
	if (roles.includes("Driver")) {
		vehicleAtt = { ...vehicleAtt, driverId: user.id };
	}

	// If user has role Employee and active role current role is Employee
	// create a vehicle with no driver
	if (req.body.asEmployee && roles.includes("Employee")) {
		vehicleAtt = { ...vehicleAtt, driverId: undefined };
	}

	const [err, vehicle] = await until(Vehicle.create(vehicleAtt));
	if (err) return responseJson(res, 500, err.message);
	if (!vehicle) return responseJson(res, 400, "Vehicle not created");

	return responseJson(res, 201, "Vehicle created successfully", vehicle);
};

export const getVehicles = async (req: any, res: any) => {
	const user = res.locals.user as User;

	const [err, vehicles] = await until(
		user.$get("vehicles", { include: [{ all: true }] })
	);
	if (err) return responseJson(res, 500, err.message);
	if (!vehicles) return responseJson(res, 204, "No vehicles found");

	return responseJson(res, 200, "Vehicles retrieved successfully", vehicles);
};

export const getDriverParkingHistory = async (req: any, res: any) => {
	const user = res.locals.user as User;

	// map user.vehicles to get parking history
	const [err, parkingHistory] = await until(
		ParkingHistory.findAll({
			where: {
				vehicleId: {
					[Op.in]: user.vehicles.map((vehicle: any) => vehicle.id),
				},
			},
			include: [{ all: true }],
			order: [["createdAt", "DESC"]],
		})
	);
	if (err) return responseJson(res, 500, err.message);
	return responseJson(
		res,
		200,
		"Parking history retrieved successfully",
		parkingHistory
	);
};

export const getVehicleParkingHistory = async (req: any, res: any) => {
	const user = res.locals.user as User;
	const { vehicleId } = req.params;

	const [err, parkingHistory] = await until(
		ParkingHistory.findAll({
			where: {
				vehicleId,
			},
			include: [{ all: true }],
			order: [["createdAt", "DESC"]],
		})
	);
	if (err) return responseJson(res, 500, err.message);
	if (!parkingHistory) {
		return responseJson(res, 204, "No parking history found");
	}

	return responseJson(
		res,
		200,
		"Parking history retrieved successfully",
		parkingHistory
	);
};
