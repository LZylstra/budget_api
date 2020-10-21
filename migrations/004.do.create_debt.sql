CREATE TABLE debt (
     id SERIAL PRIMARY KEY,
     debt_name TEXT NOT NULL,
     balance NUMERIC(11,2),
     due_date INTERVAL DAY NOT NULL,
     curr_status budget_status DEFAULT 'Unpaid',
     interest_rate NUMERIC(11,2),
     min_payment NUMERIC(11,2),
     budget_id INTEGER REFERENCES budget(id) ON DELETE SET NULL
);