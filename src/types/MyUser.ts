import { Document } from 'mongoose';

export interface myUser extends Document {
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string
}
