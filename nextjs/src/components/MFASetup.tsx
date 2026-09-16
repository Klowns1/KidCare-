'use client';

interface MFASetupProps {
    onStatusChange?: () => void;
}

/** MFA is disabled in local-auth mode. */
export function MFASetup({ onStatusChange }: MFASetupProps) {
    void onStatusChange;
    return null;
}
