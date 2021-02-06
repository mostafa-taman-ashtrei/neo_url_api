import { Router, Response, Request } from 'express';
import { nanoid } from 'nanoid';
import validUrl from 'valid-url';

import Url from '../models/Url';
import { MyUrl } from '../types/MyUrl';
import isAuth from '../middlewares/isAuth';

const router: Router = Router();

router.post('/shrink', isAuth, async (req: Request, res: Response) => {
    const { fullUrl, shortUrl } = req.body;
    const { username } = res.locals.user;

    try {
        const isValidUrl = validUrl.isWebUri(fullUrl);
        if (!isValidUrl) return res.status(400).json({ msg: 'Invalid Url' });

        const exists: MyUrl | null = await Url.findOne({ fullUrl });
        const IsshortUrlTaken: MyUrl | null = await Url.findOne({ shortUrl });

        if (IsshortUrlTaken) return res.status(422).json({ msg: 'this short id already exists' });

        if (exists) {
            return res.json({
                msg: 'This url has already been shrunk',
                shortUrl: exists,
            });
        }

        const dataToSubmit = { fullUrl, shortUrl, username };

        if (shortUrl === '') dataToSubmit.shortUrl = nanoid();

        const newUrl: MyUrl = await Url.create(dataToSubmit);
        return res.status(200).json(newUrl);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ Error: 'A Server Error Occured' });
    }
});

router.get('/all', isAuth, async (_, res: Response) => {
    const { username } = res.locals.user;

    try {
        const data: MyUrl[] = await Url.find({ username });
        return res.status(200).json({ data });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ Error: 'A Server Error Occured' });
    }
});

router.get('/:shortUrl', async (req: Request, res: Response) => {
    const { shortUrl } = req.params;
    try {
        const urlData: MyUrl | null = await Url.findOne({ shortUrl });
        if (urlData == null) return res.status(404).json({ msg: 'No data Found' });

        urlData.clicks += 1;
        urlData.save();

        return res.redirect(urlData.fullUrl);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ Error: 'A Server Error Occured' });
    }
});

export default router;
