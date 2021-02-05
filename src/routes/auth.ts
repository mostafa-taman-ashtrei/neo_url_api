import { Request, Response, Router } from 'express';
import { hash } from 'bcrypt';

import User from '../models/User';
import { myUser } from '../types/MyUser';

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

export default router;
