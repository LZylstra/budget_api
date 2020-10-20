CREATE TABLE savings (
     id SERIAL PRIMARY KEY,
     nickname TEXT NOT NULL,
     amount NUMERIC(6,4),
     goal_date TIMESTAMP NOT NULL,
     goal NUMERIC(6,4),
     monthly_auto NUMERIC(6,4),
     budget_id INTEGER REFERENCES budget(id) ON DELETE SET NULL
);