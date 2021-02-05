import mongoose from 'mongoose';

const ConnectToDb = async (): Promise<void> => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });

        if (db) console.log('Connected to Db succesfully ...');
    } catch (e) {
        console.log(e);
        throw new Error('Unable to connect to DB');
    }
};

export default ConnectToDb;
