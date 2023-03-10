import mongoose, { Schema } from "mongoose";

const RottosSchema = new Schema({
    rnumber: String, // 문자열로 이루어진 배열
    count: Number,
});

const Rottos = mongoose.model('Rottos', RottosSchema);
export default Rottos;