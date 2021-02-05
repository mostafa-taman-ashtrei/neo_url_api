import { config } from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

import ConnectToDb from './config/db';
import urlRoutes from './routes/url';

config();

(async () => {
    const app = express();
    const port = process.env.PORT || 8000;

    app.use(helmet());
    app.use(morgan('dev'));
    app.use(express.json());

    if (process.env.NODE_ENV === 'production') {
        const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
        app.use(morgan('combined', { stream: accessLogStream }));
    }

    await ConnectToDb();

    app.use('/', urlRoutes);

    app.listen(port, () => console.log(`Server is running on port ${port}...`));
})();
