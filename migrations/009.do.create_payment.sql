
CREATE TABLE payment (
     id SERIAL PRIMARY KEY,
     amount NUMERIC(11,2),
     payment_date TIMESTAMP with time zone NOT NULL,
     note TEXT,
     parent_id INTEGER REFERENCES payment_table(id) ON DELETE SET NULL
);