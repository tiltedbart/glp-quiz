CREATE TABLE IF NOT EXISTS quiz_submissions (
  id                         SERIAL PRIMARY KEY,
  goal                       TEXT,
  height_ft                  INT,
  height_in                  INT,
  weight_lbs                 NUMERIC(6,1),
  target_weight_lbs          NUMERIC(6,1),
  bmi                        NUMERIC(5,2),
  pace                       TEXT,
  prior_meds                 TEXT,
  sex                        TEXT,
  dob                        TEXT,
  age                        INT,
  state                      TEXT,
  contraindications_active   JSONB DEFAULT '[]',
  contraindications_history  JSONB DEFAULT '[]',
  compounding_preferences    JSONB DEFAULT '[]',
  first_name                 TEXT,
  last_name                  TEXT,
  email                      TEXT,
  phone                      TEXT,
  sms_consent                BOOLEAN DEFAULT false,
  selected_med               TEXT,
  selected_duration          TEXT,
  selected_price_per_month   NUMERIC(8,2),
  stripe_session_id          TEXT,
  paid                       BOOLEAN DEFAULT false,
  raw_quiz_data              JSONB,
  created_at                 TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sub_email   ON quiz_submissions(email);
CREATE INDEX IF NOT EXISTS idx_sub_created ON quiz_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sub_paid    ON quiz_submissions(paid);
CREATE INDEX IF NOT EXISTS idx_sub_state   ON quiz_submissions(state);
CREATE INDEX IF NOT EXISTS idx_sub_med     ON quiz_submissions(selected_med);
