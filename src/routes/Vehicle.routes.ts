import {
	addVehicleByDriver,
	getVehicles,
} from "@controllers/Vehicle.controller";
import { getCurrentUserInfo } from "@middlewares/userInfo.middleware";
import { Router } from "express";

const router = Router();

// All routes refering to /**/vehicles/* require userInfo middleware
router.use(getCurrentUserInfo);
router.route("/").get(getVehicles).post(addVehicleByDriver);

export default router;
