import "module-alias/register";

import dotenv from "dotenv";
dotenv.config();

import db from "@models/index";

const { User, Role, UserRole, IdentityCardType } = db.Models;