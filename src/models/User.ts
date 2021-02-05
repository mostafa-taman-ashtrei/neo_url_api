import {
    Schema, model, Model,
} from 'mongoose';
import { myUser } from '../types/MyUser';

const userSchema: Schema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
        unique: 1,
    },
    email: {
        type: String,
        required: true,
        unique: 1,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const userModel: Model<myUser> = model('User', userSchema);
export default userModel;
