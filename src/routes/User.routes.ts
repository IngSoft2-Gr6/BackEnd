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

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
