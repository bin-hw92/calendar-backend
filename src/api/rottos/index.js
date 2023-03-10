import Router from "koa-router";
import * as rottosCtrl from "./rottos.ctrl";

const rottos = new Router();

rottos.post('/save', rottosCtrl.save); //게시판 비밀번호 확인
rottos.get('/list', rottosCtrl.list); //게시판 비밀번호 확인

export default rottos;