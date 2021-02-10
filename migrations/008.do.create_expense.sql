CREATE TABLE expense (
    expense_id SERIAL PRIMARY KEY,
    expense_amount MONEY DEFAULT 0.00 NOT NULL,
    expense_date TIMESTAMPTZ DEFAULT now(),
    expense_desc TEXT,
    expense_type TEXT NOT NULL,
    category_id INTEGER REFERENCES category(category_id) ON DELETE SET NULL
    
);

