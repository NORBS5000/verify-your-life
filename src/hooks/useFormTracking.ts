import { useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const STEP_NAMES: Record<number, string> = {
  1: "Profile",
  2: "Medical",
  3: "Collateral",
  4: "Verify",
  5: "Guarantors",
  6: "Review",
};

export function useFormTracking(phoneNumber?: string) {
  const sessionId = useRef(
    `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  );
  const currentTrackingId = useRef<string | null>(null);
  const stepEnteredAt = useRef<number>(Date.now());

  const trackStepEnter = useCallback(
    async (stepNumber: number) => {
      // Close previous step
      if (currentTrackingId.current) {
        const durationSeconds = Math.round(
          (Date.now() - stepEnteredAt.current) / 1000
        );
        await supabase
          .from("form_tracking" as any)
          .update({
            left_at: new Date().toISOString(),
            duration_seconds: durationSeconds,
            event_type: "step_leave",
          } as any)
          .eq("id", currentTrackingId.current);
      }

      stepEnteredAt.current = Date.now();

      // Insert new step entry
      const { data } = await supabase
        .from("form_tracking" as any)
        .insert({
          session_id: sessionId.current,
          phone_number: phoneNumber || null,
          step_number: stepNumber,
          step_name: STEP_NAMES[stepNumber] || `Step ${stepNumber}`,
          event_type: "step_enter",
          entered_at: new Date().toISOString(),
        } as any)
        .select("id")
        .single();

      currentTrackingId.current = (data as any)?.id || null;
    },
    [phoneNumber]
  );

  const trackFormComplete = useCallback(async () => {
    // Close last step
    if (currentTrackingId.current) {
      const durationSeconds = Math.round(
        (Date.now() - stepEnteredAt.current) / 1000
      );
      await supabase
        .from("form_tracking" as any)
        .update({
          left_at: new Date().toISOString(),
          duration_seconds: durationSeconds,
          event_type: "completed",
        } as any)
        .eq("id", currentTrackingId.current);
    }
  }, []);

  return { trackStepEnter, trackFormComplete, sessionId: sessionId.current };
}
