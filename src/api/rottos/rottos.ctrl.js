import Rottos from "../../models/rottos";

export const save = async ctx => {

    const { rnumber, count } = ctx.request.body;

     try{
        rnumber.map(async (item, index) => {
            const count2 = count[index];
            const number = item;
            const test = await save2({rnumber:number, count:count2});
            if(index === rnumber.length-1){
                console.log(test, '###2#');
                ctx.body = test;
            }
        });
        ctx.body = 'test';
        return;
    }catch(e){
        console.log(e);
        ctx.throw(500, e);
    } 
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
        const rottos = await Rottos.find({count: {$gt: 3}})
                        .sort({ count: -1})
                        .lean()
                        .exec();
        const total = await Rottos.count();
        ctx.body = {data: rottos, total:total};
    }catch (e){
        ctx.throw(500, e);
    }
};
