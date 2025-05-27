import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    async function middleware(req) {
        // console.log(req.url)
        const pathname = req.nextUrl.pathname                               // current path of user

        const isAuth = await getToken({ req })                              // getting token from the reqeust. checking is user authenticated
        const isLoginPage = pathname.startsWith('/login')                   // checking is user trying to access login page

        const sensitiveRoute = ['/dashboard']                                // defining all sensitive path
        const isAccessingSensitiveRoute = sensitiveRoute.some((route) => pathname.startsWith(route))  // checking if user trying to access a sensitive path

        if(isLoginPage) {                              
            if(isAuth) {
                return NextResponse.redirect(new URL('/dashboard', req.url))
            }

            return NextResponse.next()     // if not authenticated, use remain on the login page 
        }

        if(!isAuth && isAccessingSensitiveRoute ) {
            return NextResponse.redirect(new URL('login', req.url))
        }

        if(pathname === '/') {
            return NextResponse.redirect(new URL('dashboard', req.url))
        }

    }, {
        //next-auth specific
        callbacks: {                         // hadling redirects on auth pages, it avoids infinite redirects
            async authorized() {
                return true
            }
        }
    }
)

export const config = {
    matchter: ['/', '/login', '/dashboard/:path*']   // middleware should apply to this paths 
}