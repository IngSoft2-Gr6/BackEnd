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
import {
	addEmployee,
	deleteEmployee,
	getEmployees,
} from "@controllers/Employee.controllers";
import {
	getParkingLotHistory,
	manageParkingHistory,
} from "@controllers/ParkingHistory.controllers";

const router = Router();

router.route("/").get(getAllParkings).post(getCurrentUserInfo, registerParking);

router.route("/:parkingLotId*").all(getParkingLotInfo);
router
	.route("/:parkingLotId")
	.get(getParking)
	.patch(getCurrentUserInfo, updateParking)
	.delete(getCurrentUserInfo, deleteParking);

router
	.route("/:parkingLotId/employee")
	.get(getCurrentUserInfo, getEmployees)
	.post(getCurrentUserInfo, addEmployee);

router
	.route("/:parkingLotId/employee/:employeeId")
	.delete(getCurrentUserInfo, deleteEmployee);

router
	.route("/:parkingLotId/businessHours")
	.put(updateBusinessHours)
	.delete(deleteBusinessHours);

router
	.route("/:parkingLotId/history")
	.get(getCurrentUserInfo, getParkingLotHistory)
	.put(getCurrentUserInfo, manageParkingHistory);

export default router;
