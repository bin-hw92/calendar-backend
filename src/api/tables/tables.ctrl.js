import Table from "../../models/tables";
import mongoose from "mongoose";
import Joi from "joi";
import sanitizeHtml from "sanitize-html";

const { ObjectId } = mongoose.Types;

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

export const getTableById = async(ctx, next) => {
    const { id } = ctx.params;
    if(!ObjectId.isValid(id)){
        ctx.status = 400; //Bad Request
        return;
    }

    try{
        const table = await Table.findById(id);
        // 포스트가 존재하지 않을 때
        if(!table){
            ctx.status = 404; // Not Found
            return;
        }
        ctx.state.table = table;
        return next();
    }catch(e){
        ctx.throw(500, e);
    }
}

export const write = async ctx => {
    const schema = Joi.object().keys({
        // 객체가 다음 필드를 가지고 있음을 검증
        title: Joi.string().required(), // required()가 있으면 필수 항목
        body: Joi.string().required(),
        users: Joi.array()
            .items(Joi.string())
            .required(), //문자열로 이루어진 배열
    });
    // 검증하고 나서 검증 실패인 경우 에러 처리
    const result = schema.validate(ctx.request.body);
    if(result.error){
        ctx.status = 400; // Bad Request
        ctx.body = result.error;
        return;
    }

    const { title, body, users } = ctx.request.body;
    const table = new Table({
        title,
        body: sanitizeHtml(body, sanitizeOption),
        users,
        user: ctx.state.user,
    });
    
    try{
        await table.save();
        ctx.body = table;
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
    GET /api/posts?username=&tags=&page=
*/
export const list = async ctx => {

    const {users, username} = ctx.query;
    //tag, username 값이 유효하면 객체 안에 넣고, 그렇지 않으면 넣지 않음
    const query = {
        ...(username ? {'user.username' : username} : {}),
        ...(users ? {users: users} : {}),
    };

    try{
        const tables = await Table.find(query)
                        .sort({ _id: -1})
                        .lean()  // 해당 데이터를 JSON형태로 조회
                        .exec(); //내림차순, 10개씩 보여주기
        //const tableCount = await Post.countDocuments(query).exec();
        //ctx.set('Last-Page', Math.ceil(postCount / 10));
        ctx.body = tables.map(table => ({
                        ...table,
                        body: removeHtmlAndShorten(table.body),
                    })); //길이가 200자 이상이면 자르기
    }catch (e){
        ctx.throw(500, e);
    }
};

export const read = async ctx => {
    ctx.body = ctx.state.table;
};

export const remove = async ctx => {
    const { id } = ctx.params;
    try{
        await Table.findByIdAndRemove(id).exec();
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
       users: Joi.array().items(Joi.string()),
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
        const table = await Table.findByIdAndUpdate(id, nextData, 
            {
                new: true, // 이 값을 설정하면 업데이트된 데이터를 반환합니다. 
                           // false일 때는 업데이트되기 전의 데이터를 반환합니다.
            }).exec();
            if(!table){
                ctx.status = 404;
                return;
            }
        ctx.body = table;
    }catch (e){
        ctx.throw(500, e);
    }
};

export const checkOwnTables = (ctx, next) => {
    const {user, table} = ctx.state;
    if(table.user._id.toString() !== user._id) { //포스트 등록자와 현재 사용자 동일 여부 체크
        ctx.status = 403;
        return;
    }
    return next();
}
