import { Sequelize } from "sequelize-typescript";

const DB_DIALECT = process.env.DB_DIALECT || "postgres";
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "postgres";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_NAME = process.env.DB_NAME || "postgres";
const DB_PORT = parseInt(String(process.env.DB_PORT)) || 5432;
const DB_SCHEMA = process.env.DB_SCHEMA || "public";

export const sequelize = new Sequelize({
	database: DB_NAME,
	dialect: DB_DIALECT as any,
	username: DB_USER,
	password: DB_PASSWORD,
	host: DB_HOST,
	port: DB_PORT,
	schema: DB_SCHEMA,
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
});

export default sequelize;
