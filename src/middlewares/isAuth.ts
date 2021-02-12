import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import User from '../models/User';
import { myUser } from '../types/MyUser';

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.cookies;
        if (!token) throw new Error('Unauthenticated');

        const { username }: any = verify(token, process.env.JWT_SECRET!);

        const user: myUser | null = await User.findOne({ username });
        if (!user) throw new Error('Unauthenticated');

        const resUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        res.locals.user = resUser;
        return next();
    } catch (e) {
        console.log(e);
        return res.status(401).json({ Error: 'Unauthenticated' });
    }
};

export default isAuth;
