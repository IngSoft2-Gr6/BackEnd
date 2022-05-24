import { Router } from "express";
import {
	getAllUsers,
	getUser,
	signup,
	login,
	updateUser,
	deleteUser,
} from "@controllers/User.controllers";
import { verifyToken } from "@middlewares/auth.middleware";

const router = Router();

// add swagger documentation
/**
 * @swagger
 * /users:
 * get:
 *  description: Get all users
 * tags:
 * - Users
 * produces:
 * - application/json
 *
 * /users/{id}:
 */

router.route("/").get(getAllUsers);

router.route("/signup").post(signup);

router.route("/login").post(login);

router
	.route("/profile")
	.get(verifyToken, getUser)
	.patch(verifyToken, updateUser)
	.delete(verifyToken, deleteUser);

router.use("/parking", require("./Parking.routes").default);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
