import {
	BusinessHours,
	BusinessHoursAddAttributes,
	BusinessHoursPatchAttributes,
	TimeFormat,
} from "@models/BusinessHours.model";
import {
	ParkingLot,
	ParkingLotAddAttributes,
	ParkingLotPatchAttributes,
} from "@models/ParkingLot.model";
import { responseJson } from "@helpers/response";
import { User } from "@models/User.model";
import {
	addHours,
	format as formatTime,
	isValid as isValidDate,
} from "date-and-time";

import until from "@helpers/until";
import { enforceFormat } from "@utils/datetime";

export const getAllParkings = async (_req: any, res: any) => {
	// TODO: Add pagination
	const [err, parkings] = await until(
		ParkingLot.findAll({ include: [{ all: true }] })
	);
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
	parkingAtt.ownerId = (res.locals.user as User).id;

	const [err, parkingLot] = await until(ParkingLot.create(parkingAtt));
	if (err) return responseJson(res, 500, err.message);
	if (!parkingLot) return responseJson(res, 400, "Parking not created");

	let final_message = "Parking created successfully";

	// Generate business hours from day one to day seven
	const newBusinessHours: BusinessHoursAddAttributes[] = [
		...Array(7).keys(),
	].map((day) => {
		const currDate = new Date();

		return {
			parkingLotId: parkingLot.id,
			day: day + 1,
			openTime: formatTime(currDate, TimeFormat, true),
			closeTime: formatTime(addHours(currDate, 1), TimeFormat, true),
		};
	});

	const [err2, businessHours] = await until(
		newBusinessHours.map((businessHour) =>
			BusinessHours.create({ ...businessHour, parkingLotId: parkingLot.id })
		)
	);
	if (err2 || !businessHours || typeof businessHours[0] === "undefined") {
		final_message += " but business hours not created";
	}
	return responseJson(res, 201, final_message, {
		...parkingLot,
		businessHours,
	});
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
	const { id: parkingLotId } = res.locals.parkingLot as ParkingLot;

	const businessHoursNew: BusinessHoursPatchAttributes[] = req.body;

	const error =
		!Array.isArray(businessHoursNew) ||
		businessHoursNew.some(({ openTime = "", closeTime = "", day = 0 }) => {
			return (
				!isValidDate(openTime, TimeFormat) ||
				!isValidDate(closeTime, TimeFormat) ||
				day < 1 ||
				day > 7
			);
		});

	if (error) return responseJson(res, 400, "Invalid business hours");

	if (!parkingLotId) return responseJson(res, 400, "No parking lot provided");

	const [err, parkingFound] = await until(ParkingLot.findByPk(parkingLotId));
	if (err) return responseJson(res, 500, "Error finding parking lot");
	if (!parkingFound) return responseJson(res, 404, "Parking lot not found");

	// We either insert or update the business hours
	// FIXME: Check whether the user is the owner of the parking lot
	const [err2, businessHoursUpdate] = await until(
		businessHoursNew.map(async ({ openTime, closeTime, day }) => {
			return BusinessHours.upsert({
				parkingLotId,
				day: day as number,
				openTime: enforceFormat(openTime as string, TimeFormat),
				closeTime: enforceFormat(closeTime as string, TimeFormat),
			});
		})
	);

	if (err2) return responseJson(res, 500, err2.message);
	if (typeof businessHoursUpdate[0] === "undefined") {
		return responseJson(res, 400, "Business hours not updated");
	}

	const businessHours = (businessHoursUpdate as [BusinessHours, null][]).map(
		(upsertResult) => upsertResult[0]
	);

	return responseJson(
		res,
		200,
		"Business hours updated successfully",
		businessHours
	);
};

export const deleteBusinessHours = async (req: any, res: any) => {
	const { id: parkingLotId } = res.locals.parkingLot as ParkingLot;
	const { days }: { days: number[] } = req.body;

	const error =
		!Array.isArray(days) ||
		days.some((day) => Number(day) < 1 || Number(day) > 7);

	if (error) {
		return responseJson(
			res,
			400,
			"Invalid days to delete bussiness hours from"
		);
	}

	const [err, businessHours] = await until(
		days.map((day) => {
			return BusinessHours.destroy({
				where: {
					parkingLotId,
					day: parseInt(day + ""),
				},
			});
		})
	);

	if (err) return responseJson(res, 500, err.message);

	return responseJson(
		res,
		200,
		`Business hours deleted successfully from ${days.length} days`,
		businessHours
	);
};

export const deleteParking = async (req: any, res: any) => {
	const parkingLot = res.locals.parkingLot as ParkingLot;

	const [err2, parkingLotDeleted] = await until(parkingLot.destroy());
	if (err2) return responseJson(res, 500, err2.message);
	if (!parkingLotDeleted) {
		return responseJson(res, 400, "Parking lot not deleted");
	}

	return responseJson(
		res,
		200,
		"Parking deleted successfully",
		parkingLotDeleted
	);
};
