BEGIN;


INSERT INTO budget_users (user_name, full_name, password)
VALUES
('lzylstra', 'Lindsey Zylstra', '$2a$12$d1t6lPTxudxoqWG2dCfZ4u9R0lXUE4RFC2dzqHi5mUM/DC7D8VIqm'),
('fancy', '100k Salary', '$2a$12$d1t6lPTxudxoqWG2dCfZ4u9R0lXUE4RFC2dzqHi5mUM/DC7D8VIqm'),
('demo', 'Demo User', '$2a$12$d1t6lPTxudxoqWG2dCfZ4u9R0lXUE4RFC2dzqHi5mUM/DC7D8VIqm')
;

INSERT INTO budget (monthly_pay, additional_income, user_id)
VALUES
('6250.00', '0', 2),
('4985.08', '0', 1),
('3750.00', '150.00', 3)
;

INSERT INTO bill (bill_name, cost, due_date, curr_status, budget_id)
VALUES
('Internet', '75.00', '30', 'Paid', 3),
('Phone', '45.00', '15', 'Paid', 3),
('Rent', '1015.00', '1', 'Unpaid', 3),
('Electric', '60.00', '9', 'Unpaid', 3)
;

INSERT INTO debt(debt_name, balance, due_date, curr_status, interest_rate, min_payment, budget_id)
VALUES
('Student Loan', '150000.00', '9', 'Paid', '1.5', '246.00', 3),
('Amex Credit Card', '35600.00', '17', 'Unpaid', '13.5', '456.00', 3)
;

INSERT INTO savings (nickname, amount, goal_date, goal, monthly_auto, budget_id)
VALUES
('Emergency Savings', '1375.30', '12/30/2022', '10000.00', '75.00', 3),
('Travel Savings', '364.60', '02/20/2022', '5000.00', '25.00', 3),
('Car Expenses Savings', '0.30', '04/25/2021', '2000.00', '125.00', 3)
;

INSERT INTO expense (expense_year, expense_category, monthly_max, budget_id)
VALUES
('2020', 'Food', '300.00', 3),
('2020', 'Shopping', '150.00', 3),
('2020', 'Fun', '100.00', 3)
;

INSERT INTO expense_item (amount, expense_date, expense_desc, expense_type, expense_id)
VALUES
('53.25', '10/01/2020', 'Safeway snacks', 'Groceries', 1),
('23.25', '10/03/2020', 'Sandwich Shack', 'Eating Out', 1),
('25.05', '10/04/2020', 'New shirt', 'Clothes', 2),
('15.00', '10/03/2020', 'New James Bond movie', 'Movie', 3),
('23.25', '10/01/2020', 'Poke bowl', 'Eating Out', 1),
('13.25', '10/05/2020', 'Flowers for porch', 'Shopping', 2)
;

INSERT INTO payment_table (payment_type, savings_id, bill_id, debt_id)
VALUES
('Bill', null, 1, null),  
('Debt', null, null, 1),  
('Debt', null, null, 1),  
('Savings', 1, null, null),  
('Bill', null, 2, null)
;

INSERT INTO payment(amount, payment_date, note, parent_id)
VALUES
('75.00', '10/03/2020', null, 1),  
('246.00', '10/05/2020', null, 2),  
('306.00', '10/08/2020', null, 3), 
('32.12', '10/09/2020', null, 4),  
('45.00', '10/16/2020', null, 5) 
;



 COMMIT;