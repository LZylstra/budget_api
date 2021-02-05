CREATE TABLE debt (
     id SERIAL PRIMARY KEY,
     debt_name TEXT NOT NULL,
     debt_balance MONEY DEFAULT 0.00,
     debt_due_date INTERVAL DAY NOT NULL,
     current_status budget_status DEFAULT 'Unpaid',
     interest_rate NUMERIC,
     debt_min_payment MONEY DEFAULT 0.00,
     budget_id INTEGER REFERENCES budget(id) ON DELETE SET NULL
);