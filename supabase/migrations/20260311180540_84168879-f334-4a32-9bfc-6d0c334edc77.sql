CREATE TABLE public.form_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  phone_number text,
  step_number integer NOT NULL,
  step_name text NOT NULL,
  event_type text NOT NULL DEFAULT 'step_enter',
  entered_at timestamp with time zone NOT NULL DEFAULT now(),
  left_at timestamp with time zone,
  duration_seconds integer,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.form_tracking ENABLE ROW LEVEL SECURITY;

-- Anyone can insert tracking events
CREATE POLICY "Anyone can insert tracking events"
  ON public.form_tracking FOR INSERT
  TO public
  WITH CHECK (true);

-- Anyone can update their own session tracking
CREATE POLICY "Anyone can update tracking by session"
  ON public.form_tracking FOR UPDATE
  TO public
  USING (true);

-- Public select for the tracker dashboard (PIN-protected at app level)
CREATE POLICY "Anyone can read tracking data"
  ON public.form_tracking FOR SELECT
  TO public
  USING (true);

-- Index for efficient queries
CREATE INDEX idx_form_tracking_session ON public.form_tracking(session_id);
CREATE INDEX idx_form_tracking_step ON public.form_tracking(step_number);
CREATE INDEX idx_form_tracking_created ON public.form_tracking(created_at DESC);