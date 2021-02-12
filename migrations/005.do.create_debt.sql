CREATE TABLE debt (
     debt_id SERIAL PRIMARY KEY,
     debt_name TEXT NOT NULL,
     debt_balance MONEY DEFAULT 0.00,
     debt_due_date INTERVAL DAY NOT NULL,
     current_status curr_status DEFAULT 'Unpaid',
     interest_rate NUMERIC DEFAULT 0,
     debt_min_payment MONEY DEFAULT 0.00,
     budget_id INTEGER REFERENCES budget(budget_id) ON DELETE SET NULL
);

ALTER TABLE payments
  ADD COLUMN
    debt_id INTEGER REFERENCES debt(debt_id) ON DELETE SET NULL;