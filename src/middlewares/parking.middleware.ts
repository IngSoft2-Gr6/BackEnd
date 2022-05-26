import { responseJson } from "@helpers/response";
import { until } from "@helpers/until";
import { ParkingLot } from "@models/ParkingLot.model";

export const getParkingLotInfo = async (req: any, res: any, next: any) => {
	const { parkingLotId } = req.params;
	if (!parkingLotId) return responseJson(res, 400, "No parking id provided");

	const [err, parkingLot] = await until(ParkingLot.findByPk(parkingLotId));
	if (err) return responseJson(res, 500, err.message);
	if (!parkingLot) return responseJson(res, 404, "Parking not found");

	res.locals.parkingLot = parkingLot;
	next();
};
