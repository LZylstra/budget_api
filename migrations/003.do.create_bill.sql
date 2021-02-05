CREATE TYPE budget_status AS ENUM ('Unpaid', 'Paid', 'Late', 'Due', 'On Hold');

CREATE TABLE bill (
     id SERIAL PRIMARY KEY,
     bill_name TEXT NOT NULL,
     bill_cost MONEY DEFAULT 0.00,
     bill_due_date INTERVAL DAY NOT NULL,
     current_status budget_status DEFAULT 'Unpaid',
     budget_id INTEGER REFERENCES budget(id) ON DELETE SET NULL
);