import { responseJson } from "@helpers/response";
import until from "@helpers/until";
import { EmployeeParkingLot } from "@models/EmployeeParkingLot.model";
import { ParkingLot } from "@models/ParkingLot.model";
import { User } from "@models/User.model";
import { sendMail } from "@services/mail.service";

import jwt from "jsonwebtoken";
import { signup } from "./User.controllers";

const { JWT_SECRET, FRONT_URL, MAIL_TOKEN_EXPIRATION_TIME } = process.env as {
	[key: string]: string;
};

export const verifyEmployeeToken = (req: any, res: any) => {
	const { token } = req.body;
	if (!token) return responseJson(res, 400, "Token not provided");

	// TODO: Add error handling
	const decoded = jwt.verify(token, JWT_SECRET) as any;
	if (!decoded) return responseJson(res, 400, "Invalid token");

	res.locals.decodedEmployee = decoded;
};

export const assignEmployee = async (req: any, res: any) => {
	const user = res.locals.user as User;
	const { parkingLotId } = res.locals.decodedEmployee;

	const [err, employeeParkingLot] = await until(
		EmployeeParkingLot.create({ employeeId: user.id, parkingLotId })
	);
	if (err) return responseJson(res, 500, err.message);
	if (!employeeParkingLot) {
		return responseJson(res, 400, "Employee not created");
	}
};

export const addEmployee = async (req: any, res: any) => {
	const user = res.locals.user as User;
	const parkingLot = res.locals.parkingLot as ParkingLot;

	const { employeeEmail } = req.body;

	if (!(user.id === parkingLot.ownerId)) {
		return responseJson(res, 401, "Incorrect parkingLot Owner");
	}

	// Create token with user id
	const token = jwt.sign({ parkingLotId: parkingLot.id }, JWT_SECRET, {
		expiresIn: MAIL_TOKEN_EXPIRATION_TIME,
	});

	const [err3, mail] = await until(
		sendMail({
			to: employeeEmail,
			subject: "New Employee",
			placeholders: {
				userName: user.name.split(" ")[0],
				url: `${FRONT_URL}/home?token=${token}&employee#signup`,
			},
		})
	);
	if (err3) return responseJson(res, 500, err3.message);
	if (!mail) return responseJson(res, 400, "Mail not sent");

	return responseJson(res, 200, "Mail sent to Employee");
};

export const getEmployees = async (req: any, res: any) => {
	const user = res.locals.user as User;
	const parkingLot = res.locals.parkingLot as ParkingLot;

	if (!(user.id === parkingLot.ownerId)) {
		return responseJson(res, 401, "Incorrect parkingLot Owner");
	}

	const [err, employees] = await until(
		EmployeeParkingLot.findAll({ where: { parkingLotId: parkingLot.id } })
	);
	if (err) return responseJson(res, 500, err.message);
	if (!employees) return responseJson(res, 404, "Employees not found");

	return responseJson(res, 200, "Employees retrieved successfully", employees);
};

export const deleteEmployee = async (req: any, res: any) => {
	const user = res.locals.user as User;
	const parkingLot = res.locals.parkingLot as ParkingLot;

	if (!(user.id === parkingLot.ownerId)) {
		return responseJson(res, 401, "Incorrect parkingLot Owner");
	}

	const { employeeId } = req.params;

	const [err, deletedEmployee] = await until(
		EmployeeParkingLot.destroy({
			where: { employeeId, parkingLotId: parkingLot.id },
		})
	);
	if (err) return responseJson(res, 500, err.message);
	if (!deletedEmployee) return responseJson(res, 400, "Employee not deleted");

	return responseJson(
		res,
		200,
		"Employee deleted successfully",
		deletedEmployee
	);
};
