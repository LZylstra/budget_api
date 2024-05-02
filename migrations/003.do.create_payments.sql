DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pay_type') THEN
        CREATE TYPE pay_type AS ENUM ('Bill', 'Savings', 'Checking', 'Debt');
    END IF;
END$$;

CREATE TABLE payments(
    payments_id SERIAL PRIMARY KEY,
    payment_type pay_type NOT NULL,
    payment_note TEXT,
    payment_date TIMESTAMPTZ DEFAULT now(),
    payment_amount MONEY DEFAULT 0.00 NOT NULL
);

