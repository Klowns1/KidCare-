const DEFAULT_NEXT = '/app';

export const PUBLIC_APP_PATHS = ['/app', '/app/knowledge', '/app/contact'];

export function isPublicAppPath(pathname: string): boolean {
    return PUBLIC_APP_PATHS.includes(pathname);
}

export function safeNextPath(next: string | null | undefined): string {
    if (!next || !next.startsWith('/') || next.startsWith('//') || next.includes('\\')) {
        return DEFAULT_NEXT;
    }
    return next;
}

export function authPath(kind: 'login' | 'register', next?: string | null): string {
    return `/auth/${kind}?next=${encodeURIComponent(safeNextPath(next))}`;
}
