import { Router } from "express";
import {
	getAllUsers,
	getUser,
	signup,
	login,
	updateUser,
	deleteUser,
	resetPassword,
	verifyAccount,
	recover,
} from "@controllers/User.controllers";

import { getCurrentUserInfo } from "@middlewares/userInfo.middleware";
import { addVehicleByDriver } from "@controllers/Vehicle.controller";

const router = Router();

router.route("/").get(getAllUsers);

router.route("/signup").post(signup);

router.route("/login").post(login);

router.route("/verify/account").post(verifyAccount);

router.route("/password").post(recover);
router.route("/password/reset").post(resetPassword);

// All routes refering to /**/profile/* require userInfo middleware
router.route("/profile*").all(getCurrentUserInfo);
router.route("/profile").get(getUser).patch(updateUser).delete(deleteUser);

// All routes refering to /**/vehicles/* require userInfo middleware
router.route("/vehicles*").all(getCurrentUserInfo);
router.route("/vehicles").post(addVehicleByDriver);

// router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
// FIXME: This should use a custom middleware and different controllers
// These might be useful for specific use cases such an employee trying to
// get some information about a specific user or when an owner wants to
// update some information about a specific employee.
// router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
