import { Router } from "express";
import {
	getAllUsers,
	getUser,
	register,
	login,
	updateUser,
	deleteUser,
} from "@controllers/User.controllers";

const router = Router();

router.route("/").get(getAllUsers);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

router.route("/register").post(register);

router.route("/login").post(login);

export default router;
