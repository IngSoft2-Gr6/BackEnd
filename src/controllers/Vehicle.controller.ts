import { responseJson } from "@helpers/response";
import { Vehicle, VehicleAddAttributes } from "@models/Vehicle.model";
import { User } from "@models/User.model";

import until from "@helpers/until";

export const addVehicleByDriver = async (req: any, res: any) => {
	const user = res.locals.user as User;

	const vehicleAtt: VehicleAddAttributes = { ...req.body, driverId: user.id };

	const [err, vehicle] = await until(Vehicle.create(vehicleAtt));
	if (err) return responseJson(res, 500, err.message);
	if (!vehicle) return responseJson(res, 400, "Vehicle not created");

	return responseJson(res, 201, "Vehicle created successfully", vehicle);
};
