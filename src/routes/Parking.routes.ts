import { Router } from "express";
import {
	deleteParking,
	getcapacity,
	getfee,
	registerParking,
	updateBusinessHours,
	updatefee,
	updateParking,
} from "@controllers/Parking.controllers";

const router = Router();
router.route("/:id").post(registerParking);
router
	.route("/profile/:id")
	.get(getcapacity)
	.get(getfee)
	.patch(updateParking)
	.patch(updateBusinessHours)
	.patch(updatefee)
	.delete(deleteParking);

export default router;
