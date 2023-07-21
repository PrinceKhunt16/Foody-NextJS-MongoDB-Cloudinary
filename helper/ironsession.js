import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

const sessionOptions = {
    cookieName: process.env.TOKEN_NAME,
    password: process.env.IRON_SESSION_PASSWORD,
    cookieOptions: {
        secure: true
    }
}

export function withSessionRoute(handler) {
    return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler) {
    return withIronSessionSsr(handler, sessionOptions);
}