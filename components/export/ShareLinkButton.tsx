"use client";

import { useState } from "react";
import type { SkinProfile } from "@/types/skin-profile";
import { encodeProfile } from "@/lib/encoding/profile-encoder";

interface ShareLinkButtonProps {
  profile: SkinProfile;
}

export function ShareLinkButton({ profile }: ShareLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const encoded = encodeProfile(profile);
    const url = `${window.location.origin}/dashboard?profile=${encoded}`;

    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-on-surface bg-surface-container-low hover:bg-surface-container-highest rounded-lg transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        />
      </svg>
      {copied ? "Link Copied!" : "Share Protocol"}
    </button>
  );
}
