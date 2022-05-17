import { Router } from "express";
import {
	getAllUsers,
	getUser,
	register,
	login,
	updateUser,
	deleteUser,
} from "@controllers/User.controllers";
import { verifyToken } from "@middlewares/auth.middleware";

const router = Router();

router.route("/").get(getAllUsers);

router.route("/register").post(register);

router.route("/login").post(login);

router
	.route("/profile")
	.get(verifyToken, getUser)
	.patch(verifyToken, updateUser)
	.delete(verifyToken, deleteUser);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
