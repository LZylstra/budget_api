CREATE TABLE category (
     category_id SERIAL PRIMARY KEY,
     expense_year INTERVAL YEAR NOT NULL,
     category_name TEXT NOT NULL,
     monthly_max MONEY DEFAULT 0.00,
     budget_id INTEGER REFERENCES budget(budget_id) ON DELETE SET NULL
);