DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'acc_type') THEN
        CREATE TYPE acc_type AS ENUM ('Checking', 'Savings');
    END IF;
END$$;


CREATE TABLE accounts (
     account_id SERIAL PRIMARY KEY,
     account_name TEXT NOT NULL,
     account_amount MONEY DEFAULT 0.00,
     goal_date TIMESTAMPTZ DEFAULT now(),
     goal_amount MONEY DEFAULT 0.00,
     monthly_auto MONEY DEFAULT 0.00,
     account_type acc_type NOT NULL,
     budget_id INTEGER REFERENCES budget(budget_id) ON DELETE SET NULL
);

ALTER TABLE payments
  ADD COLUMN
    account_id INTEGER REFERENCES accounts(account_id) ON DELETE SET NULL;