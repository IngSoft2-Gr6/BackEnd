import { Role } from "@models/Role.model";
import { BusinessHours } from "@models/BusinessHours.model";
import {
	ParkingLot,
	ParkingLotAddAttributes,
	ParkingLotPatchAttributes,
} from "@models/ParkingLot.model";
import { responseJson } from "@helpers/response";
import { until } from "@helpers/until";

export const getAllParkings = async (_req: any, res: any) => {
	// TODO: Add pagination
	const [err, parkings] = await until(ParkingLot.findAll());
	if (err) return responseJson(res, 500, err.message);
	if (!parkings) return responseJson(res, 204, "No parkings found");
	return responseJson(res, 200, "Parking retrieved successfully", parkings);
};

export const getParking = async (req: any, res: any) => {
	const parking = res.locals.parkingLot as ParkingLot;
	return responseJson(res, 200, "Parking retrieved successfully", parking);
};

export const registerParking = async (req: any, res: any) => {
	const parkingAtt: ParkingLotAddAttributes = { ...req.body };
	parkingAtt.ownerId = req.params.id;

	const [err, parking] = await until(ParkingLot.create(parkingAtt));
	if (err) return responseJson(res, 500, err.message);
	if (!parking) return responseJson(res, 400, "Parking not created");
	return responseJson(res, 201, "Parking created successfully", parking);
};

export const updateParking = async (req: any, res: any) => {
	const parkingFound = res.locals.parkingLot as ParkingLot;

	const parkingAtt: ParkingLotPatchAttributes = { ...req.body };

	const [err2, parkingLotUpdate] = await until(parkingFound.update(parkingAtt));
	if (err2) return responseJson(res, 500, err2.message);
	if (!parkingLotUpdate) return responseJson(res, 400, "Parking not updated");

	return responseJson(
		res,
		200,
		"Parking updated successfully",
		parkingLotUpdate
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
