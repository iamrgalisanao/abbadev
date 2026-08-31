-- ABBADev seminar/webinar registrations (Postgres)
-- Rows are sign-ups from the /register page, forwarded by the consultation
-- proxy with channel = 'event'. One row per registration.

CREATE TABLE IF NOT EXISTS event_registrations (
  id             BIGSERIAL PRIMARY KEY,
  name           TEXT        NOT NULL,
  email          TEXT        NOT NULL,
  audience       TEXT,         -- 'Student' | 'SME owner'
  organization   TEXT,         -- school or company
  phone          TEXT,
  event_id       TEXT,         -- session slug, or 'notify-next' for the waitlist
  event_title    TEXT,
  event_start    TIMESTAMPTZ,  -- machine-readable session start (enriched in the Code node)
  event_when     TEXT,         -- human-readable session date/time as emailed
  event_mode     TEXT,         -- 'Online' | 'In-person · Metro Manila' | ...
  message        TEXT,
  source         TEXT,         -- 'abbadev.com'
  channel        TEXT,         -- 'event' (stamped by the consultation proxy)
  page_url       TEXT,
  submitted_at   TIMESTAMPTZ,  -- client-reported submission time
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  status         TEXT        NOT NULL DEFAULT 'registered',
  -- registered | confirmed | attended | no_show | cancelled | waitlist
  reminded_at    TIMESTAMPTZ   -- set by the reminder workflow once a reminder is sent
);

-- Fast "newest first" review, per-session rosters, and de-dup lookups by email.
CREATE INDEX IF NOT EXISTS event_registrations_created_at_idx ON event_registrations (created_at DESC);
CREATE INDEX IF NOT EXISTS event_registrations_email_idx      ON event_registrations (email);
CREATE INDEX IF NOT EXISTS event_registrations_event_id_idx   ON event_registrations (event_id);
CREATE INDEX IF NOT EXISTS event_registrations_event_start_idx ON event_registrations (event_start);

-- One sign-up per email per session. The Postgres Insert node should use
-- "on conflict do nothing" (or an upsert) so a double submit is a no-op, not an
-- error — the visitor still sees the success screen either way. Waitlist rows
-- ('notify-next') can legitimately repeat, so they are excluded from the rule.
CREATE UNIQUE INDEX IF NOT EXISTS event_registrations_unique_signup
  ON event_registrations (email, event_id)
  WHERE event_id <> 'notify-next';
