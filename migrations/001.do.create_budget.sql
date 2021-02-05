CREATE TABLE budget (
     id SERIAL PRIMARY KEY,
     monthly_pay MONEY DEFAULT 0.00,
     additional_income MONEY DEFAULT 0.00

);