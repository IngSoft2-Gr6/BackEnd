import { Router } from "express";
import {
	deleteParking,
	getAllParkings,
	getParking,
	registerParking,
	updateParking,
} from "@controllers/Parking.controllers";
import { getParkingLotInfo } from "@middlewares/parking.middleware";

const router = Router();

router.route("/").get(getAllParkings).post(registerParking);

router.route("/:parkingLotId*").all(getParkingLotInfo);
router
	.route("/:parkingLotId")
	.get(getParking)
	.patch(updateParking)
	.delete(deleteParking);

export default router;
