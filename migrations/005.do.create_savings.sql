CREATE TABLE savings (
     id SERIAL PRIMARY KEY,
     savings_name TEXT NOT NULL,
     savings_amount MONEY DEFAULT 0.00,
     goal_date TIMESTAMP with time zone NOT NULL,
     goal_amount MONEY DEFAULT 0.00,
     monthly_auto MONEY DEFAULT 0.00,
     budget_id INTEGER REFERENCES budget(id) ON DELETE SET NULL
);