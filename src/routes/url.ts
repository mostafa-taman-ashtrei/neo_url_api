import { Router, Response, Request } from 'express';
import { nanoid } from 'nanoid';
import validUrl from 'valid-url';

import Url from '../models/Url';
import { MyUrl } from '../types/MyUrl';

const router: Router = Router();

router.post('/shrink', async (req: Request, res: Response) => {
    const { fullUrl, shortUrl } = req.body;

    try {
        const isValidUrl = validUrl.isWebUri(fullUrl);
        if (!isValidUrl) return res.status(400).json({ msg: 'Invalid Url' });

        const dataToSubmit = { fullUrl, shortUrl };
        const exists: MyUrl | null = await Url.findOne({ fullUrl });
        if (exists) {
            return res.json({
                msg: 'This url has already been shrunk',
                shortUrl: exists.shortUrl,
            });
        }

        if (shortUrl === '') dataToSubmit.shortUrl = nanoid();
        console.log(dataToSubmit);

        const newUrl = await Url.create(dataToSubmit);

        return res.status(200).json(newUrl);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ Error: e });
    }
});

export default router;
