import { NextResponse } from 'next/server'

/** OAuth callback is unused in local-auth mode. */
export async function GET(request: Request) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
}
