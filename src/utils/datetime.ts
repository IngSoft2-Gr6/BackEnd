import date from "date-and-time";

export const enforceFormat = (value: string, format: string) => {
	return date.format(date.parse(value, format), format);
};
