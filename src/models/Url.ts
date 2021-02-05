import {
    Schema, model, Model,
} from 'mongoose';
import { nanoid } from 'nanoid';
import { MyUrl } from '../types/MyUrl';

const urlSchema: Schema = new Schema({
    fullUrl: {
        type: String,
        required: true,
        unique: 1,
    },
    shortUrl: {
        type: String,
        required: true,
        default: nanoid(),
        unique: 1,
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
}, { timestamps: true });

const urlModel: Model<MyUrl> = model('Url', urlSchema);
export default urlModel;
