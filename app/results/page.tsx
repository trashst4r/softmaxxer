"use client";

/**
 * Sprint 24.8: Results → Protocol Redirect
 * Consolidated into /protocol page
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function ResultsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Sprint 24.8: Redirect to consolidated protocol page
    router.replace("/protocol");
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-3">
        <div className="text-sm text-on-surface-variant">Redirecting to protocol...</div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return <ResultsRedirect />;
}
