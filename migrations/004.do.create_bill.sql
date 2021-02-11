CREATE TYPE curr_status AS ENUM ('Unpaid', 'Paid', 'Late', 'Due', 'On Hold');

CREATE TABLE bill (
     bill_id SERIAL PRIMARY KEY,
     bill_name TEXT NOT NULL,
     bill_cost MONEY DEFAULT 0.00,
     bill_due_date INTERVAL DAY NOT NULL,
     current_status curr_status DEFAULT 'Unpaid',
     budget_id INTEGER REFERENCES budget(budget_id) ON DELETE SET NULL
);

ALTER TABLE payments
  ADD COLUMN
    bill_id INTEGER REFERENCES bill(bill_id) ON DELETE SET NULL;