import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";

const transporter = nodemailer
	.createTransport({
		service: process.env.EMAIL_SERVICE,
		host: process.env.EMAIL_HOST,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	})
	.use(
		"compile",
		hbs({
			viewEngine: { extname: ".hbs", defaultLayout: false },
			viewPath: __dirname + "/../../public/templates",
			extName: ".hbs",
		})
	);

export const sendMail = async ({
	to,
	from = process.env.EMAIL_USER as string,
	attachments = [],
	placeholders,
	replyTo = process.env.EMAIL_USER as string,
	subject = "Mail",
	template = "mailTemplate",
	text = "",
}: {
	to: string;
	subject: string;
	attachments?: any[];
	from?: string;
	placeholders?: any;
	replyTo?: string;
	template?: string;
	text?: string;
}) => {
	const mailOptions = {
		from,
		to,
		replyTo,
		subject: `SParking - ${subject}`,
		text,
		attachments,
		context: {
			...placeholders,
			title: "Welcome to SParking",
			siteName: "SParking",
			message: `We have received a request for the ${subject.toLowerCase()} service.`,
			buttonText: `${subject}`,
		},
		template,
	};
	return transporter.sendMail(mailOptions);
};
