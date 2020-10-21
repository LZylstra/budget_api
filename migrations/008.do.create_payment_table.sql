CREATE TYPE pay_type AS ENUM ('Bill', 'Savings', 'Debt');

CREATE TABLE payment_table(
    id SERIAL PRIMARY KEY,
    payment_type pay_type NOT NULL,
    savings_id INTEGER REFERENCES savings(id) ON DELETE SET NULL,
    bill_id INTEGER REFERENCES bill(id) ON DELETE SET NULL,
    debt_id INTEGER REFERENCES debt(id) ON DELETE SET NULL
);
