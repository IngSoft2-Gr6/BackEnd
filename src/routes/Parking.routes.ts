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
import { getCurrentUserInfo } from "@middlewares/userInfo.middleware";
import { addEmployee } from "@controllers/Employee.controllers";

const router = Router();

router.route("/").get(getAllParkings).post(getCurrentUserInfo, registerParking);

router.route("/:parkingLotId*").all(getParkingLotInfo);
router
	.route("/:parkingLotId")
	.get(getParking)
	.patch(getCurrentUserInfo, updateParking)
	.delete(getCurrentUserInfo, deleteParking);

router.route("/:parkingLotId/employee").post(getCurrentUserInfo, addEmployee);

router
	.route("/:parkingLotId/businessHours")
	.put(updateBusinessHours)
	.delete(deleteBusinessHours);

export default router;
