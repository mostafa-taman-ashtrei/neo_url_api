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

        const exists: MyUrl | null = await Url.findOne({ fullUrl });
        const IsshortUrlTaken: MyUrl | null = await Url.findOne({ shortUrl });

        if (IsshortUrlTaken) return res.status(422).json({ msg: 'this short id already exists' });

        if (exists) {
            return res.json({
                msg: 'This url has already been shrunk',
                shortUrl: exists?.shortUrl,
            });
        }

        const dataToSubmit = { fullUrl, shortUrl };
        if (shortUrl === '') dataToSubmit.shortUrl = nanoid();
        console.log(dataToSubmit);

        const newUrl = await Url.create(dataToSubmit);

        return res.status(200).json(newUrl);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ Error: 'A Server Error Occured' });
    }
});

export default router;
