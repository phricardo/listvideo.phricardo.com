-- Add feature flags column to users and backfill with defaults

ALTER TABLE users
ADD COLUMN IF NOT EXISTS features TEXT[] NOT NULL DEFAULT '{}'::text[];

-- Activated accounts can create/read sessions; pending accounts keep the activation token only
UPDATE users
SET features = ARRAY['create:session', 'read:session']
WHERE is_account_activated IS TRUE;

UPDATE users
SET features = ARRAY['read:activation_token']
WHERE is_account_activated IS NOT TRUE;
