CREATE TABLE debt (
     id SERIAL PRIMARY KEY,
     debt_name TEXT NOT NULL,
     balance NUMERIC(6,4),
     due_date TIMESTAMP NOT NULL,
     curr_status budget_status NOT NULL,
     interest_rate NUMERIC(6,4),
     min_payment NUMERIC(6,4),
     actual_payment NUMERIC(6,4),
     budget_id INTEGER REFERENCES budget(id) ON DELETE SET NULL
);