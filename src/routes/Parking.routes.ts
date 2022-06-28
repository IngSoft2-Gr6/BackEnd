import { Router } from "express";
import {
	deleteBusinessHours,
	deleteParking,
	getAllParkings,
	getParking,
	registerParking,
	updateBusinessHours,
	updateParking,
	addRatingParking,
	getRatingParking,
} from "@controllers/Parking.controllers";
import { getParkingLotInfo } from "@middlewares/parking.middleware";
import {
	addEmployee,
	deleteEmployee,
	getEmployees,
} from "@controllers/Employee.controllers";
import {
	getParkingLotHistory,
	manageParkingHistory,
} from "@controllers/ParkingHistory.controllers";
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
	.route("/:parkingLotId/employee")
	.get(getCurrentVerifiedUserInfo, getEmployees)
	.post(getCurrentVerifiedUserInfo, addEmployee);

router
	.route("/:parkingLotId/employee/:employeeId")
	.delete(getCurrentVerifiedUserInfo, deleteEmployee);

router
	.route("/:parkingLotId/businessHours")
	.put(getCurrentVerifiedUserInfo, updateBusinessHours)
	.delete(getCurrentVerifiedUserInfo, deleteBusinessHours);

router
	.route("/:parkingLotId/history")
	.get(getCurrentVerifiedUserInfo, getParkingLotHistory)
	.put(getCurrentVerifiedUserInfo, manageParkingHistory);

router
	.route("/:parkingLotId/rating")
	.get(getCurrentVerifiedUserInfo, getRatingParking)
	.post(getCurrentVerifiedUserInfo, addRatingParking);

export default router;
