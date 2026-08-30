-- ABBADev chat-assistant consultation leads (Postgres)
-- Leads that reach this table are business owners who completed the
-- "Book a consult" flow inside the site assistant. General knowledge-base
-- questions are answered client-side and never hit this workflow.

CREATE TABLE IF NOT EXISTS chat_leads (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT,
  email         TEXT        NOT NULL,
  challenge     TEXT        NOT NULL,
  work_focus    TEXT,
  engagement    TEXT,
  source        TEXT,        -- e.g. 'assistant-chat'
  channel       TEXT,        -- 'chat' (stamped by the consultation proxy)
  page_url      TEXT,
  submitted_at  TIMESTAMPTZ, -- client-reported submission time
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  status        TEXT        NOT NULL DEFAULT 'new' -- new | reviewed | contacted | won | lost | not_fit
);

-- Fast "newest first" review and de-dup lookups by email.
CREATE INDEX IF NOT EXISTS chat_leads_created_at_idx ON chat_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS chat_leads_email_idx      ON chat_leads (email);
