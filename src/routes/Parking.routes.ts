import { Router } from "express";
import {
	deleteBusinessHours,
	deleteParking,
	getAllParkings,
	getParking,
	registerParking,
	updateBusinessHours,
	updateParking,
} from "@controllers/Parking.controllers";
import { getParkingLotInfo } from "@middlewares/parking.middleware";
import { getCurrentVerifiedUserInfo } from "@middlewares/userInfo.middleware";

const router = Router();

router
	.route("/")
	.get(getAllParkings)
	.post(getCurrentVerifiedUserInfo, registerParking);

router.route("/:parkingLotId*").all(getParkingLotInfo);
router
	.route("/:parkingLotId")
	.get(getParking)
	.patch(getCurrentVerifiedUserInfo, updateParking)
	.delete(getCurrentVerifiedUserInfo, deleteParking);

router
	.route("/:parkingLotId/businessHours")
	.put(getCurrentVerifiedUserInfo, updateBusinessHours)
	.delete(getCurrentVerifiedUserInfo, deleteBusinessHours);

export default router;
