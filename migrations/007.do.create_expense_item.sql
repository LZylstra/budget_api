CREATE TABLE expense_item (
     id SERIAL PRIMARY KEY,
     amount NUMERIC(11,2),
     expense_date TIMESTAMP with time zone NOT NULL,
     expense_desc TEXT,
     expense_type TEXT NOT NULL,
     expense_id INTEGER REFERENCES expense(id) ON DELETE SET NULL
);