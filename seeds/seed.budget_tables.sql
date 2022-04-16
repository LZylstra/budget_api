BEGIN;


INSERT INTO budget_users (user_name, full_name, password)
VALUES
('lzylstra', 'Lindsey Zylstra', '$2a$12$d1t6lPTxudxoqWG2dCfZ4u9R0lXUE4RFC2dzqHi5mUM/DC7D8VIqm'),
('demo', 'Demo User', '$2a$12$d1t6lPTxudxoqWG2dCfZ4u9R0lXUE4RFC2dzqHi5mUM/DC7D8VIqm')
;

INSERT INTO budget (monthly_pay, additional_income, user_id)
VALUES
('6250.00', '150', 1),
('8234.50', '0', 2),
('543.23', '0', 2)
;


INSERT INTO bill (bill_name, bill_cost, bill_due_date, current_status, budget_id)
VALUES
('Internet', '75.00', '30', 'Paid', 2),
('Phone', '45.00', '15', 'Paid', 2),
('Rent', '2400', '1', 'Unpaid', 2),
('Electric', '150.34', '9', 'Unpaid', 2),
('Insurance', '50.32', '10', 'Unpaid', 3)
;

INSERT INTO debt(debt_name, debt_balance, debt_due_date, current_status, interest_rate, debt_min_payment, budget_id)
VALUES
('Student Loan', '150000.00', '9', 'Paid', '1.5', '246.00', 2),
('Amex Credit Card', '35600.00', '17', 'Unpaid', '13.5', '456.00', 2),
('Citi Credit Card', '5430.40', '23', 'Unpaid', '11.5', '256.00', 3)
;

INSERT INTO accounts (account_name, account_amount, goal_date, goal_amount, monthly_auto, account_type, budget_id)
VALUES
('Emergency Savings', '1375.30', '12/30/2025', '10000.00', '75.00', 'Savings', 2),
('Travel Savings', '364.60', '02/20/2024', '5000.00', '25.00', 'Savings', 2),
('Car Expenses Savings', '0.30', '04/25/2023', '2000.00', '125.00', 'Savings', 2),
('WF Checking', '2345.50', null, null, null, 'Checking', 3)
;

INSERT INTO payments (payment_type, account_id, bill_id, debt_id, payment_note, payment_date, payment_amount)
VALUES
('Bill', null, 4, null, 'Electricity', '02/09/21', '150.34'),  
('Debt', null, null, 1, 'Student Loan', '02/03/21', '300.00'),  
('Debt', null, null, 2, 'Credit Card', '02/04/21', '600.00'),  
('Savings', 2, null, null, 'Vacation', '02/05/21', '260.00'),  
('Bill', null, 3, null, 'Rent', '02/03/21', '2400.00') 
;

INSERT INTO category (category_year, category_name, monthly_max, budget_id)
VALUES
('2022', 'Food', '300.00', 2),
('2022', 'Shopping', '150.00', 2),
('2022', 'Fun', '100.00', 2)
;

INSERT INTO expense (expense_amount, expense_date, expense_desc, expense_type, category_id)
VALUES
('53.25', '02/01/2022', 'Safeway snacks', 'Groceries', 1),
('23.25', '02/03/2022', 'Sandwich Shack', 'Eating Out', 1),
('25.05', '02/04/2022', 'New shirt', 'Clothes', 2),
('15.00', '02/03/2022', 'New James Bond movie', 'Movie', 3),
('23.25', '02/01/2022', 'Poke bowl', 'Eating Out', 1),
('13.25', '02/05/2022', 'Flowers for porch', 'Shopping', 2)
;





 COMMIT;