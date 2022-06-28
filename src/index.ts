import "module-alias/register";

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import db from "@models/index";
import generate from "./data";

// Settings
const app = express();
const port = process.env.API_PORT || 8080;

const isDevelopment = process.env.NODE_ENV === "development";

app.disable("x-powered-by");

// Exception handlers
process.on("uncaughtException", (error) => {
	console.error("Uncaught exception: ", error);
	process.exit(1); // exit application
});

process.on("unhandledRejection", (error, promise) => {
	console.error("Unhandled promise: ", promise);
	console.error("The error was: ", error);
});

// Middlewares
app.use(
	cors({
		origin: [process.env.FRONT_URL as string],
		credentials: true,
		exposedHeaders: ["set-cookie"],
	})
);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/", require("./routes/").default);

// Start server
db.sequelize
	.sync({ force: isDevelopment })
	.then(async () => {
		if (isDevelopment) {
			console.log("Database & tables created!");
			await generate(["Role", "IdentityCardType", "VehicleType"]);
		}
	})
	.then(() => {
		app.listen(port, () => {
			// print url
			console.log(`Server running in ${process.env.NODE_ENV} mode`);
			console.log(`Server running on http://localhost:${port}`);
		});
	})
	.catch((err) => console.log("Unable to connect to the database:", err));
