'use client';

interface SSOButtonsProps {
    onError?: (error: string) => void;
}

/** SSO requires an external identity provider — disabled in local-only mode. */
export default function SSOButtons({ onError }: SSOButtonsProps) {
    void onError;
    return null;
}
