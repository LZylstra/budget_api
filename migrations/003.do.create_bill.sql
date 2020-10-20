CREATE TYPE budget_status AS ENUM ('Unpaid', 'Paid', 'Late', 'Due', 'On Hold');

CREATE TABLE bill (
     id SERIAL PRIMARY KEY,
     bill_name TEXT NOT NULL,
     cost NUMERIC(6,4),
     due_date TIMESTAMP NOT NULL,
     curr_status budget_status NOT NULL,
     budget_id INTEGER REFERENCES budget(id) ON DELETE SET NULL
);