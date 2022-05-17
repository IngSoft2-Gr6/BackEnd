import "module-alias/register";

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import db from "@models/index";

const { User, Role, UserRole, IdentityCardType } = db.Models;

// Settings
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/", require("./routes/").default);

// Start server
db.sequelize
	.sync({ force: process.env.NODE_ENV === "development" })
	.then(async () => {
		console.log("Database & tables created!");
		// create default roles
		await db.Models.Role.bulkCreate([
			{ name: "admin" },
			{ name: "driver" },
			{ name: "owner" },
			{ name: "employee" },
		]);
		// create default identity card types
		await db.Models.IdentityCardType.bulkCreate([
			{ name: "Identity Card" },
			{ name: "Passport" },
			{ name: "Driving License" },
		]);
	})
	.then(() => {
		app.listen(port, () => {
			// print url
			console.log(`Server running on http://localhost:${port}`);
		});
	})
	.catch((err) => console.log("Unable to connect to the database:", err));
