-- Convert location columns from enum to plain text
-- Users should be able to enter any location (e.g. "Sotogrande", "London", "Monaco")
-- Previously blocked inserts because free-text didn't match the enum

ALTER TABLE roles ALTER COLUMN location TYPE TEXT USING location::TEXT;
ALTER TABLE roles ALTER COLUMN location_region TYPE TEXT USING location_region::TEXT;

ALTER TABLE candidate_profiles ALTER COLUMN location TYPE TEXT USING location::TEXT;
ALTER TABLE candidate_profiles ALTER COLUMN location_region TYPE TEXT USING location_region::TEXT;
