'use client';

interface MFASetupProps {
    onStatusChange?: () => void;
}

/** MFA is disabled in local-auth mode. */
export function MFASetup(_props: MFASetupProps) {
    return null;
}
