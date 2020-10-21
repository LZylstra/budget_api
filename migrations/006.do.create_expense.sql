CREATE TABLE expense (
    id SERIAL PRIMARY KEY,
    expense_year INTERVAL YEAR,
    expense_category TEXT NOT NULL,
    monthly_max NUMERIC(11,2),
    budget_id INTEGER REFERENCES budget(id) ON DELETE SET NULL
);

