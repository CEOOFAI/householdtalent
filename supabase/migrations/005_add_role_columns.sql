-- Add missing columns to roles table for expanded role posting form
ALTER TABLE roles ADD COLUMN IF NOT EXISTS employment_type text;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS requirements text[] DEFAULT '{}';
ALTER TABLE roles ADD COLUMN IF NOT EXISTS languages text[] DEFAULT '{}';
ALTER TABLE roles ADD COLUMN IF NOT EXISTS hours_type text;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS hours_per_week integer;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS salary_band text;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS plan text;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS plan_price integer;
