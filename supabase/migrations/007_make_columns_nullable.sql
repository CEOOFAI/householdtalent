-- Make location_region nullable to prevent crashes when form doesn't send it
ALTER TABLE roles ALTER COLUMN location_region DROP NOT NULL;
ALTER TABLE roles ALTER COLUMN location SET DEFAULT 'gibraltar';
ALTER TABLE roles ALTER COLUMN location_region SET DEFAULT 'gibraltar';

-- Make experience_preferred nullable (form doesn't always send it)
ALTER TABLE roles ALTER COLUMN experience_preferred DROP NOT NULL;
