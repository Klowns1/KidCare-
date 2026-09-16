'use client';

interface MFAVerificationProps {
    onSuccess?: () => void;
}

/** MFA is disabled in local-auth mode. */
export default function MFAVerification(_props: MFAVerificationProps) {
    return null;
}
