"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function TelemetryProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Collect telemetry data
    const vgId = searchParams.get("utm_vanguard");
    const source = searchParams.get("utm_source");
    const referrer = document.referrer || "direct";
    const userAgent = navigator.userAgent;

    // Simulate sending data to Supabase `traffic_logs` table
    const logData = {
      path: pathname,
      vanguard_id: vgId,
      source: source,
      referrer: referrer,
      user_agent: userAgent,
      timestamp: new Date().toISOString(),
    };

    // In a real DB environment, this would be: 
    // supabase.from('traffic_logs').insert([logData])
    console.log("[VQCP Telemetry] Payload Captured:", logData);

  }, [pathname, searchParams]);

  // This is a UI-less component. It just sits in the background.
  return null;
}
