CREATE TABLE savings (
     savings_id SERIAL PRIMARY KEY,
     savings_name TEXT NOT NULL,
     savings_amount MONEY DEFAULT 0.00,
     goal_date TIMESTAMPTZ NOT NULL DEFAULT now(),
     goal_amount MONEY DEFAULT 0.00,
     monthly_auto MONEY DEFAULT 0.00,
     budget_id INTEGER REFERENCES budget(budget_id) ON DELETE SET NULL
);

ALTER TABLE payments
  ADD COLUMN
    savings_id INTEGER REFERENCES savings(savings_id) ON DELETE SET NULL;