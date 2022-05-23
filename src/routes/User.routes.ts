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

import { verifyToken } from "@middlewares/auth.middleware";
import { getUserInfo } from "@middlewares/userInfo.middleware";

const router = Router();

router.route("/").get(getAllUsers);

router.route("/signup").post(signup);

router.route("/login").post(login);

router.route("/verify/account").post(verifyAccount);

router.route("/password").post(recover);
router.route("/password/reset").post(resetPassword);

router
	.route("/profile")
	.get(getUserInfo, getUser)
	.patch(getUserInfo, updateUser)
	.delete(getUserInfo, deleteUser);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
