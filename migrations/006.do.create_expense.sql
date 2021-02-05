CREATE TABLE expense (
    id SERIAL PRIMARY KEY,
    expense_year INTERVAL YEAR,
    expense_category TEXT NOT NULL,
    monthly_max MONEY DEFAULT 0.00,
    budget_id INTEGER REFERENCES budget(id) ON DELETE SET NULL
);

