"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Console has been renamed to Dashboard
// Redirect for backwards compatibility
export default function ConsolePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="text-sm text-muted">Redirecting to Dashboard...</div>
      </div>
    </div>
  );
}
