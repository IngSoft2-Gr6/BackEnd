import { Role } from "@models/Role.model";
import { BusinessHours } from "@models/BusinessHours.model";
import { ParkingLot } from "@models/ParkingLot.model";
import { responseJson } from "@helpers/response.helpers";
import { until } from "@helpers/until.helpers";

export const getAllParkings = async (_req: any, res: any) => {
	// TODO: Add pagination
	const [err, parkings] = await until(ParkingLot.findAll());
	if (err) return responseJson(res, 500, err.message);
	if (!parkings) return responseJson(res, 204, "No parkings found");
	return responseJson(res, 200, "Parking retrieved successfully", parkings);
};

export const registerParking = async (req: any, res: any) => {
	const parkingAtt = { ...req.body };
	const [err, parking] = await until(ParkingLot.create(parkingAtt));
	if (err) return responseJson(res, 500, err.message);
	if (!parking) return responseJson(res, 400, "Parking not created");
	const [err2] = await until(parking.$add());
	if (err2) return responseJson(res, 500, err2.message);
	return responseJson(res, 201, "Parking created successfully", parking);
};

export const getfee = async (req: any, res: any) => {
	const parkingId: string = req.params.id || req.decoded.id;
	if (!parkingId) return responseJson(res, 400, "No parking id provided");

	const [err, parking] = await until(ParkingLot.findByPk(parkingId));
	if (err) return responseJson(res, 500, err.message);
	if (!parking.fee) return responseJson(res, 404, "Parking not found");

	return responseJson(
		res,
		200,
		"Parking fee retrieved successfully",
		parking.fee
	);
};

export const getcapacity = async (req: any, res: any) => {
	const parkingId: string = req.params.id || req.decoded.id;
	if (!parkingId) return responseJson(res, 400, "No parking id provided");

	const [err, parking] = await until(ParkingLot.findByPk(parkingId));
	if (err) return responseJson(res, 500, err.message);
	if (!parking) return responseJson(res, 404, "Parking not found");

	return responseJson(
		res,
		200,
		"Parking fee retrieved successfully",
		parking.capacity
	);
};

export const updateParking = async (req: any, res: any) => {
	const parkingId: string = req.params.id || req.decoded.id;
	if (!parkingId) return responseJson(res, 400, "No parking id provided");

	const [err, parkingFound] = await until(ParkingLot.findByPk(parkingId));
	if (err) return responseJson(res, 500, err.message);
	if (!parkingFound) return responseJson(res, 404, "parking not found");

	const [err2, businessHoursUpdate] = await until(
		parkingFound.update(parkingFound)
	);
	if (err2) return responseJson(res, 500, err2.message);
	if (!businessHoursUpdate)
		return responseJson(res, 400, "parking not updated");

	return responseJson(
		res,
		200,
		"parking updated successfully",
		businessHoursUpdate
	);
};

export const updateBusinessHours = async (req: any, res: any) => {
	const parkingId: string = req.params.id || req.decoded.id;
	if (!parkingId) return responseJson(res, 400, "No parking id provided");

	const [err, parkingFound] = await until(ParkingLot.findByPk(parkingId));
	if (err) return responseJson(res, 500, err.message);
	if (!parkingFound) return responseJson(res, 404, "Parking not found");

	const [err2, businessHoursFound] = await until(
		BusinessHours.findByPk(parkingId)
	);
	if (err2) return responseJson(res, 500, err2.message);
	if (!businessHoursFound)
		return responseJson(res, 404, "Business hours  not found");

	const [err3, businessHoursUpdate] = await until(
		businessHoursFound.update(businessHoursFound)
	);
	if (err3) return responseJson(res, 500, err3.message);
	if (!businessHoursUpdate)
		return responseJson(res, 400, "Business hours not updated");

	return responseJson(
		res,
		200,
		"Business hours updated successfully",
		businessHoursUpdate
	);
};

export const updatefee = async (req: any, res: any) => {
	const parkingId: string = req.params.id || req.decoded.id;
	if (!parkingId) return responseJson(res, 400, "No parking id provided");

	const [err, parkingFound] = await until(ParkingLot.findByPk(parkingId));
	if (err) return responseJson(res, 500, err.message);
	if (!parkingFound) return responseJson(res, 404, "Parking not found");

	const [err2, businessHoursUpdate] = await until(
		parkingFound.update(parkingFound.fee)
	);
	if (err2) return responseJson(res, 500, err2.message);
	if (!businessHoursUpdate)
		return responseJson(res, 400, "Parking fee not updated");

	return responseJson(
		res,
		200,
		"Parking fee updated successfully",
		businessHoursUpdate
	);
};

export const deleteParking = async (req: any, res: any) => {
	const parkingId: string = req.params.id || req.decoded.id;
	if (!parkingId) return responseJson(res, 400, "No parking id provided");
	const [err, parking] = await until(ParkingLot.findByPk(parkingId));
	if (err) return responseJson(res, 500, err.message);
	if (!parking) return responseJson(res, 404, "Parking not found");
	const [err2, parkingDeleted] = await until(
		parking.destroy({ include: [BusinessHours] })
	);
	if (err2) return responseJson(res, 500, err2.message);
	if (!parkingDeleted) return responseJson(res, 400, "Parking not deleted");
	return responseJson(res, 200, "Parking deleted successfully", parkingDeleted);
};
