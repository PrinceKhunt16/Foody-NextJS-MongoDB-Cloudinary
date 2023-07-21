import { getIronSession } from 'iron-session/edge';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    let render;
    const res = NextResponse.next();

    const session = await getIronSession(req, res, {
        cookieName: process.env.TOKEN_NAME,
        password: process.env.IRON_SESSION_PASSWORD,
        cookieOptions: {
            secure: true
        }
    });

    if (req.nextUrl.pathname.startsWith('/admin')) {
        const tokenRequired = ['/admin/dashboard', '/admin/products', '/admin/orders', '/admin/users', '/admin/profile/account'];
        const tokenShouldNotBe = ['/admin/auth/login'];

        if (tokenRequired.includes(req.nextUrl.pathname)) {
            if (session.admin) {
                render = true;
            } else {
                render = false;
            }
        }

        if (tokenShouldNotBe.includes(req.nextUrl.pathname)) {
            if (session.admin) {
                render = false;
            } else {
                render = true;
            }
        }

        if (!tokenRequired.includes(req.nextUrl.pathname) && !tokenShouldNotBe.includes(req.nextUrl.pathname)) {
            render = true;
        }
    } else if (req.nextUrl.pathname.startsWith('/auth')) {
        if (session.user) {
            render = false;
        } else {
            render = true;
        }
    } else if (req.nextUrl.pathname.startsWith('/profile')) {
        if (session.user) {
            render = true;
        } else {
            render = false;
        }
    } else if (req.nextUrl.pathname.startsWith('/cart')) {
        if (session.user) {
            render = true;
        } else {
            render = false;
        }
    } else if (req.nextUrl.pathname.startsWith('/order')) {
        if (session.user) {
            render = true;
        } else {
            render = false;
        }
    } else if (req.nextUrl.pathname.startsWith('/api/admin')) {
        if (req.nextUrl.pathname.startsWith('/api/admin/auth/login')) {
            if (session.admin) {
                render = false;
            } else {
                render = true;
            }
        } else {
            if (session.admin) {
                render = true;
            } else {
                render = false;
            }
        }
    } else if (req.nextUrl.pathname.startsWith('/api/delivery')) {
        if (req.nextUrl.pathname.startsWith('/api/delivery/auth/login')) {
            if (session.delivery) {
                render = false;
            } else {
                render = true;
            }
        } else {
            if (session.delivery) {
                render = true;
            } else {
                render = false;
            }
        }
    } else if (req.nextUrl.pathname.startsWith('/delivery')) {
        if (req.nextUrl.pathname.startsWith('/delivery/auth/login')) {
            if (session.delivery) {
                render = false;
            } else {
                render = true;
            }
        } else {
            if (session.delivery) {
                render = true;
            } else {
                render = false;
            }
        }
    }

    if (render) {
        return NextResponse.next();
    } else {
        return NextResponse.redirect(new URL('/', req.url));
    }
}

export const config = {
    matcher: ['/auth/:path*', '/profile/:path*', '/admin/:path*', '/api/admin/:path*', '/cart', '/order', '/delivery:path*', '/api/delivery/:path*'],
};