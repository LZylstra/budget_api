CREATE TABLE savings (
     id SERIAL PRIMARY KEY,
     nickname TEXT NOT NULL,
     amount NUMERIC(11,2),
     goal_date TIMESTAMP with time zone NOT NULL,
     goal NUMERIC(11,2),
     monthly_auto NUMERIC(11,2),
     budget_id INTEGER REFERENCES budget(id) ON DELETE SET NULL
);