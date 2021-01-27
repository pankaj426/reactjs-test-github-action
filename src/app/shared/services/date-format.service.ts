import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DateFormatEnum } from '../../shared/constants/enum';


@Injectable({
	providedIn: 'root'
})
export class DateFormatService {

	constructor() {
	}

	public momentDateFormat(date: any) {

		if (date != null && date != "") {
			return moment(date).format('DD-MM-YYYY');
		}
		else {
			return '-'
		}
	}
	public momentAgoDateFormat(date: any) {

		if (date != null && date != "") {
			return moment(date).fromNow();
		}
		else {
			return '-'
		}
	}
	public convertDateToRelativeDisplayText(time: any) {
		if (time != '' && time != "" && time != null && time != undefined) {
			var now = new Date();
			var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
			var date = new Date(time),
				diff = (((now_utc).getTime() - Date.parse(time)) / 1000),
				day_diff = Math.floor(diff / 86400);

			if (isNaN(day_diff)/* || day_diff < 0 || day_diff >= 31*/)
				return;

			return day_diff == 0 && (
				diff < 60 && "just now" ||
				diff < 120 && "1 min ago" ||
				diff < 3600 && Math.floor(diff / 60) + " mins ago" ||
				diff < 7200 && "1 hr ago" ||
				diff < 86400 && Math.floor(diff / 3600) + " hrs ago") ||
				day_diff < 0 && diff < 60 && "just now" ||
				day_diff == 1 && "Yesterday at " + date.toLocaleTimeString() ||
				day_diff > 0 && day_diff < 7 && day_diff + " days ago at " + date.toLocaleTimeString() ||
				date.toLocaleDateString() + " at " + date.toLocaleTimeString();
		} else {
			return;
		}

	};

	public addMonths(date: any, months: number, dateFormat: string) {
		return moment(date).add(months, 'months').format(dateFormat);
	}

	public subtractMonths(date: any, months: number, dateFormat: string) {
		return moment(date).subtract(months, 'months').format(dateFormat);
	}

	public subtractDays(date: any, days: number, dateFormat: string) {
		return moment(date).subtract(days, 'day').format(dateFormat);
	}

	public addDays(date: any, days: number, dateFormat: string) {
		return moment(date).add(days, 'day').format(dateFormat);
	}

	public checkDateGreater(fromDate: any, endDate: any) {
		let endDt = endDate.split("/");
		let endDtDay = endDt[0];
		let endDtMon = endDt[1];
		let endDtYr = endDt[2];
		var endDtDateTimeStamp = new Date(endDt[0], endDt[1] - 1, endDt[2]); //D M Y
		let frmDt = fromDate.split("/");
		let frmDtDay = frmDt[0];
		let frmDtMon = frmDt[1];
		let frmDtYr = frmDt[2];
		var frmDtDateTimeStamp = new Date(frmDt[0], frmDt[1] - 1, frmDt[2]); //D M Y
		var diffDays = ((endDtDateTimeStamp.getTime() - frmDtDateTimeStamp.getTime()) / 1000);
		if (diffDays > 0) {
			return true;
		} else {
			return false;
		}
	}
	public checkDateGreaterEqual(fromDate: any, endDate: any) {
		var startDate1 = moment(fromDate, DateFormatEnum.DDMMYYYY);
		var endDate1 = moment(endDate, DateFormatEnum.DDMMYYYY);
		var result = endDate1.diff(startDate1, 'days');

		if (result >= 0) {
			return true;
		} else {
			return false;
		}
	}


	public getDayDifference(fromDate: any, endDate: any) {
		var diffDays = ((Date.parse(endDate) - Date.parse(fromDate)) / (1000 * 60 * 60 * 24));
		return diffDays;
	}

	public getMonthDifference(fromDate: any, endDate: any) {
		return 12 * (moment(endDate).year() - moment(fromDate).year())
			+ moment(endDate).month() - moment(fromDate).month() + 1;
	}

	public getMonthDifferenceActivities(fromDate: any, endDate: any) {
		return 12 * (moment(endDate).year() - moment(fromDate).year())
			+ moment(endDate).month() - moment(fromDate).month();
	}

	public getCurrentYear() {
		var date = new Date();
		return date.getFullYear();
	}

	public getCurrentDate() {
		var date = new Date();
		return (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()) + "/" + ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + "/" + date.getFullYear();
	}

	public getYearList() {
		var currentYear = new Date().getFullYear(),
			yearsList = [];
		let startYear = 2018;
		while (startYear <= currentYear) {
			yearsList.push(startYear++);
		}
		return yearsList;
	}

	public getNotificationDateFormat(date: any) {
		return moment(date).format("h:mm A, Do MMM YY");
	}

	public weekStartAndEndDate() {
		var now = new Date();
		let start = 1;
		var today = new Date(now.setHours(0, 0, 0, 0));
		var day = today.getDay() - start;
		var date = today.getDate() - day;

		// Grabbing Start/End Dates
		var StartDate = new Date(today.setDate(date));
		var EndDate = new Date(today.setDate(date + 6));
		return [StartDate, EndDate];

	}

	public monthStartAndEndDate() {

		var date = new Date(), y = date.getFullYear(), m = date.getMonth();
		var firstDay = new Date(y, m + 1, 1);
		var lastDay = new Date(y, m + 1, 0);

		var date = new Date();
		var StartDate = new Date(date.getFullYear(), date.getMonth(), 1);
		var EndDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		return [firstDay, lastDay];

	}

}
