import { Document } from 'mongoose';

export interface MyUrl extends Document {
    fullUrl: string,
    shortUrl: string,
    clicks: number,
    username: string,
}
