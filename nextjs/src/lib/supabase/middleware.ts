import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // Local auth stores the session in the browser; middleware only passes the request through.
    return NextResponse.next({ request })
}
