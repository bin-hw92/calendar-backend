import Rottos from "../../models/rottos";

export const save = async ctx => {

    const { rnumber, count } = ctx.request.body;

     try{
        const result2 = await saveAwait(rnumber, count);
        if(!result2){
            ctx.status = 404;
            return;
        }
        ctx.body = result2;
    }catch(e){
        console.log(e);
        ctx.throw(500, e);
    }
};
export const saveAwait = async (rnumber, count) => {
    let answer = 0;
    const result = await rnumber.map(async (item, index) => {
        const count2 = count[index];
        const number = item;
        const test = await save2({rnumber:number, count:count2});
        if(await test){
            answer++;
            if(answer === rnumber.length){
                console.log(test, 'DB 저장 완료 ###2#');
                return test;
            }
        }
    }).flatMap(item => item);
    
    return await result;
};

const save2 = async ({rnumber, count}) => {
    const rotto = new Rottos({
        rnumber: rnumber,
        count: count,
    });
    try{    
        const rottoId = await Rottos.find({'rnumber': rnumber}).exec();
        if(rottoId.length > 0){
            console.log(rottoId[0]._id, '@@');
            return await Rottos.findByIdAndUpdate(rottoId[0]._id, {
                count: Number(rottoId[0].count) + 1,
            })
        }else{
            console.log(rotto, '@');
            return rotto.save();
        }
    }catch(e){
        console.log(e);
        ctx.throw(500, e);
    }
}

export const list = async ctx => {
    try{
        const max = await maxCount();
        const rottos = await Rottos.find({count: {$gt: max-1}})
                        .sort({ count: -1})
                        .lean()
                        .exec();
        const total = await Rottos.count();
        ctx.body = {data: rottos, total:total};
    }catch (e){
        ctx.throw(500, e);
    }
};

export const maxCount = async () => {
    try{
        const max = await Rottos.find().sort({ count: -1}).limit(1);
        return Number(max[0].count);
    }catch (e){
        ctx.throw(500, e);
    }
}