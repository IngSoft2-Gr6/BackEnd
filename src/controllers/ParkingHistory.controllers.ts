import { responseJson } from "@helpers/response";
import until from "@helpers/until";
import { ParkingHistory } from "@models/ParkingHistory.model";
import { ParkingLot } from "@models/ParkingLot.model";
import { User } from "@models/User.model";
import date from "date-and-time";

export const manageParkingHistory = async (req: any, res: any) => {
	const parkingLot = res.locals.parkingLot as ParkingLot;
	const user = res.locals.user as User;
	const { vehicleId } = req.body;

	// check that vehicle owner is the same user
	if (user.vehicles.find((v) => v.id === vehicleId) === undefined) {
		return responseJson(res, 400, "Vehicle owner is not the same user");
	}

	// get the latest parking history
	const [err, parkingHistory] = await until(
		ParkingHistory.findOne({
			where: {
				vehicleId,
				parkingLotId: parkingLot.id,
			},
			order: [["createdAt", "DESC"]],
		})
	);
	if (err) return responseJson(res, 500, err.message);

	if (!parkingHistory || parkingHistory?.parkingEndTime) {
		// create a new parking history
		const [err2, newParkingHistory] = await until(
			ParkingHistory.create({
				vehicleId,
				parkingLotId: parkingLot.id,
				parkingStartTime: new Date(),
				paidAmount: 0,
			})
		);
		if (err2) return responseJson(res, 500, err2.message);
		if (!newParkingHistory) {
			return responseJson(res, 400, "Parking history not created");
		}
		return responseJson(
			res,
			200,
			"Parking history created successfully",
			newParkingHistory
		);
	}

	const parkingStartTime = parkingHistory.parkingStartTime as Date;
	const parkingEndTime = new Date();

	const parkingDuration = date.subtract(parkingEndTime, parkingStartTime);

	// update the latest parking history
	const [err3, parkingHistoryUpdate] = await until(
		parkingHistory.update({ parkingEndTime })
	);
	if (err3) return responseJson(res, 500, err3.message);
	if (!parkingHistoryUpdate) {
		return responseJson(res, 400, "Parking history not updated");
	}

	const actions = {
		minute: () => Math.ceil(parkingDuration.toMinutes()) * parkingLot.fee,
		hour: () => Math.ceil(parkingDuration.toHours()) * parkingLot.fee,
	};

	// calculate the amount to be paid
	let amountToBePaid = actions[parkingLot.feePer as keyof typeof actions]();

	// if is less than the minimum fee, then pay the minimum fee
	amountToBePaid =
		amountToBePaid < parkingLot.minFee ? parkingLot.minFee : amountToBePaid;

	return responseJson(res, 200, "Parking history updated successfully", {
		parkingDuration: [
			Math.round(parkingDuration.toHours()),
			Math.round(parkingDuration.toMinutes()) % 60,
			Math.round(parkingDuration.toSeconds() % 60),
		],
		amountToBePaid,
		...parkingHistoryUpdate.get({ plain: true }),
	});
};

export const getParkingLotHistory = async (req: any, res: any) => {
	const parkingLot = res.locals.parkingLot as ParkingLot;

	const [err, parkingHistory] = await until(
		parkingLot.$get("parkingHistory", {
			include: [{ all: true }],
			order: [["createdAt", "DESC"]],
		})
	);
	if (err) return responseJson(res, 500, err.message);
	if (!parkingHistory) {
		return responseJson(res, 400, "Parking history not found");
	}

	return responseJson(
		res,
		200,
		"Parking history found successfully",
		parkingHistory
	);
};
