import Calendar from "../../models/calendar";
import mongoose from "mongoose";
import Joi from "joi";
import sanitizeHtml from "sanitize-html";

const sanitizeOption = {
    allowedTags: [
        'h1',
        'h2',
        'b',
        'i',
        'u',
        's',
        'p',
        'ul',
        'ol',
        'li',
        'blockquote',
        'a',
        'img',
    ],
    allowedAttributes: {
        a: ['href', 'name', 'target'],
        img: ['src'],
        li: ['class'],
    },
    allowedSchemes: ['data', 'http'],
};

export const getCalendarById = async(ctx, next) => {
    const { checkDate } = ctx.params;
    if(typeof checkDate !== 'string'){
        ctx.status = 400; //Bad Request
        return;
    }

    const query = {
        ...(checkDate ? {
            'startDay' : checkDate,
            'endDay' : checkDate,
    } : {}),
    };

    try{
        const calendar = await Calendar.find(query);
        if(!calendar){
            ctx.status = 404; // Not Found
            return;
        }
        ctx.state.calendar = calendar;
        return next();                    
    }catch (e){
        ctx.throw(500, e);
    }
}

export const write = async ctx => {
    const schema = Joi.object().keys({
        // 객체가 다음 필드를 가지고 있음을 검증
        title: Joi.string().required(), // required()가 있으면 필수 항목
        body: Joi.string().required(),
        startDay: Joi.string().required(),
        startDate: {
            year: Joi.string().required(),
            month: Joi.string().required(),
            date: Joi.string().required(),
            hour: Joi.string().required(),
            min: Joi.string().required(),
        },
        endDay: Joi.string().required(),
        endDate: {
            year: Joi.string().required(),
            month: Joi.string().required(),
            date: Joi.string().required(),
            hour: Joi.string().required(),
            min: Joi.string().required(),
        },
        label: {
            style: Joi.string().required(),
            text: Joi.string().required(),
        }
    });
    // 검증하고 나서 검증 실패인 경우 에러 처리
    const result = schema.validate(ctx.request.body);
    if(result.error){
        ctx.status = 400; // Bad Request
        ctx.body = result.error;
        return;
    }

    const { title, body, startDay, startDate, endDay, endDate, label } = ctx.request.body;
    const calendar = new Calendar({
        title,
        body: sanitizeHtml(body, sanitizeOption),
        startDay,
        startDate,
        endDay,
        endDate,
        label,
        user: ctx.state.user,
    });
    
    try{
        await calendar.save();
        ctx.body = calendar;
    }catch(e){
        ctx.throw(500, e);
    }
};

// html을 업애고 내용이 너무 길면 200자로 제한하는 함수
const removeHtmlAndShorten = body => {
    const filtered = sanitizeHtml(body, {
        allowedTags: [],
    });
    return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`;
};

/*
    GET /api/calendar?year=&month=
*/
export const list = async ctx => {
    const year = ctx.query.year || ''+new Date().getFullYear;
    const month = ctx.query.month ||  ("0" + (1 + new Date().getMonth())).slice(-2);
    if(year.length < 1 || month.length < 1){
        ctx.status = 400;
        return;
    }

    const query = {
        ...(year ? {'startDate.year' : year} : {}),
        ...(month ? {'startDate.month' : month} : {}),
    };

    try{
        const calendar = await Calendar.find(query)
                        .sort({ _id: -1})
                        .lean()  // 해당 데이터를 JSON형태로 조회
                        .exec();
        const calendarCount = await Calendar.countDocuments(query).exec();
        //ctx.set('Last-Page', Math.ceil(postCount / 10));
        ctx.body = calendar.map(calendar => ({
                        ...calendar,
                        body: removeHtmlAndShorten(calendar.body),
                    })); //길이가 200자 이상이면 자르기
    }catch (e){
        ctx.throw(500, e);
    }
};

export const read = async ctx => {
    ctx.body = ctx.state.calendar;
};

export const remove = async ctx => {
    const { id } = ctx.params;
    try{
        await Calendar.findByIdAndRemove(id).exec();
        ctx.status = 204; // No Content (성공하기는 했지만 응답할 데이터는 없음)
    }catch (e){
        ctx.throw(500, e);
    }
};

export const update = async ctx => {
    const { id } = ctx.params;
    // write에서 사용한 schema와 비슷한데, required()가 없습니다.
    const schema = Joi.object().keys({
       title: Joi.string(),
       body: Joi.string(),
       startDay: Joi.string(),
       startDate: Joi.string(),
       endDay: Joi.string(),
       endDate: Joi.string(),
       label: Joi.string(),
    });

    // 검증하고 나서 검증 실패인 경우 에러 차리
    const result = schema.validate(ctx.request.body);
    if(result.error){
        ctx.status = 400; // Bad Request
        ctx.body = result.error;
        return;
    }
    
    const nextData = {...ctx.request.body}; // 객체를 복사하고 body 값이 주어졌으면 HTML 필터링
    if(nextData.body){
        nextData.body = sanitizeHtml(nextData.body, sanitizeOption);
    }

    try{
        const calendar = await Calendar.findByIdAndUpdate(id, nextData, 
            {
                new: true, // 이 값을 설정하면 업데이트된 데이터를 반환합니다. 
                           // false일 때는 업데이트되기 전의 데이터를 반환합니다.
            }).exec();
            if(!calendar){
                ctx.status = 404;
                return;
            }
        ctx.body = calendar;
    }catch (e){
        ctx.throw(500, e);
    }
};

export const checkOwnCalendar = (ctx, next) => {
    const {user, calendar} = ctx.state;
    if(calendar.user._id.toString() !== user._id) { //포스트 등록자와 현재 사용자 동일 여부 체크
        ctx.status = 403;
        return;
    }
    return next();
}
