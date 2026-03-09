-- =============================================
-- TEMPLATE TABLES — run AFTER schema.sql
-- =============================================

CREATE TABLE workout_templates (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE template_exercises (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id     UUID NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id     UUID NOT NULL REFERENCES exercises(id),
  exercise_order  INTEGER NOT NULL,
  target_sets     INTEGER NOT NULL DEFAULT 3,
  notes           TEXT,         -- instruksi / cue per exercise
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_template_exercises_template ON template_exercises(template_id);

-- Auto-update updated_at on template changes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_templates_updated_at
  BEFORE UPDATE ON workout_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
