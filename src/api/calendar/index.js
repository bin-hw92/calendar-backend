import Router from "koa-router";
import checkLoggedIn from "../../lib/checkLoggedIn";
import * as calendarCtrl from "./calendar.ctrl";

const calendars = new Router();

calendars.get('/', calendarCtrl.list);
calendars.post('/', checkLoggedIn, calendarCtrl.write); //로그인 여부 확인

const calendar = new Router(); // /api/posts/:checkDate
calendar.get('/', calendarCtrl.read);
calendar.delete('/', checkLoggedIn, calendarCtrl.checkOwnCalendar, calendarCtrl.remove); //로그인과 등록자 동일여부 확인
calendar.patch('/', checkLoggedIn, calendarCtrl.checkOwnCalendar, calendarCtrl.update); //로그인과 등록자 동일여부 확인

calendars.use('/:checkDate', calendarCtrl.getCalendarById, calendar.routes());

export default calendars;