import { Request, Response, Router } from 'express';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import cookie from 'cookie';

import User from '../models/User';
import { myUser } from '../types/MyUser';
import isAuth from '../middlewares/isAuth';

const router: Router = Router();

router.post('/register', async (req: Request, res: Response) => {
    const {
        firstName,
        lastName,
        username,
        email,
        password,
    } = req.body;

    interface myError {
        email?: string
        username?: string,
        password?: string,
        firstName?: string,
        lastName?: string,
    }

    try {
        const errors: myError = {};

        const emailExists: myUser | null = await User.findOne({ email });
        const usernameExists: myUser | null = await User.findOne({ username });

        if (emailExists) errors.email = 'This Email is taken, try another one ...';
        if (usernameExists) errors.username = 'This username is taken, try another one ...';
        if (password.length < 8) errors.password = 'Password must be atleast 8 characters';

        if (Object.keys(errors).length > 0) return res.status(400).json(errors);

        const hashedPwd = await hash(password, 12);

        const newUser = await User.create({
            firstName,
            lastName,
            username,
            email,
            password: hashedPwd,
        });

        return res.status(200).json({ newUser });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ Error: 'A server error occured ' });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    interface myError {
        username?: string,
        password?: string,
    }

    try {
        const errors: myError = {};

        if (username === '' || username === undefined) errors.username = 'Username is Required ...';
        if (password === '' || password === undefined) errors.password = 'Password is Required ...';

        if (Object.keys(errors).length > 0) return res.status(400).json(errors);

        const user: myUser | null = await User.findOne({ username });
        if (!user) return res.status(404).json({ Error: 'Invalid username' });

        const matchPwd = await compare(password, user.password);
        if (!matchPwd) return res.status(404).json({ Error: 'Invalid password' });

        // create token and set a cookie

        const token = sign({ username }, process.env.JWT_SECRET!);

        res.set('Set-Cookie', cookie.serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600,
            path: '/',
        }));

        return res.status(200).json({ user });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ Error: 'A server error occured ' });
    }
});

router.get('/me', isAuth, (_, res) => res.json(res.locals.user));

router.get('/logout', isAuth, (_, res: Response) => {
    res.set('Set-Cookie', cookie.serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0),
        path: '/',
    }));

    return res.status(200).json({ message: 'you are logged out ...' });
});

export default router;
