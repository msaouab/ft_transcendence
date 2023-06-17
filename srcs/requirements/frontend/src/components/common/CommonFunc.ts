/*
Common functions for chat components
*/

import Cookies from "js-cookie";
// get date fromatted as Tue, 12:00
export const getDateChat = (date: string) => {
	const d = new Date(date);
	const day = d.toLocaleDateString("en-US", { weekday: "short" });
	const hour = d.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
	});
	return `${day}, ${hour} `;
};

export const dateStrToNum = (dateStr: string) => {
	// convet date string to number
	// 2023-05-04T12:38:43.532Z -> 20230504123843
	return Number(dateStr.replace(/[-T:.Z]/g, ""));
};

export const dateToStr = (date: Date): string => {
	// convet date string to number
	// 2023-05-04T12:38:43.532Z -> 20230504123843
	return date.toISOString().replace(/[-T:.Z]/g, "");
};

export const getAvatarUrl = () => {
	// get avatar url from id
	const id = Cookies.get("id");
	console.log("--------------------------------------:",id);
	return `http://localhost:3000/api/v1/user/${id}/avatar`;
};
