import { config } from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import ConnectToDb from '../config/db';

config();

(async () => {
    const app = express();
    const port = process.env.PORT || 8000;

    app.use(helmet());
    app.use(morgan('dev'));

    await ConnectToDb();

    app.get('/', (_, res) => res.json({ msg: 'Hello World!' }));
    app.listen(port, () => console.log(`Server is running on port ${port}...`));
})();
