import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: process.env.EMAIL_SERVICE,
	host: process.env.EMAIL_HOST,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

export const sendMail = async (to: string, subject: string, text: string) => {
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to,
		subject: `SParking - ${subject}`,
		text,
	};
	return transporter.sendMail(mailOptions);
};
