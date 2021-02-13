const xss = require("xss");

const ExpenseService = {
  getAllExpenses(db) {
    return db.select("*").from("expense");
  },
  getAllCategoryExpenses(db,expense_id) {
    return db
      .from("expense AS e")
      .select(
        "e.expense_id",
        "e.expense_amount",
        "e.expense_date",
        "e.expense_desc",
        "e.expense_type",
        "e.category_id",
        ...categoryFields
      )
      .leftJoin("category AS cat", "e.category_id", "cat.category_id")
      .where("e.category_id", expense_id);
  },
  getById(db, expense_id) {
    return db
      .from("expense")
      .select("*")
      .where("expense.expense_id", expense_id)
      .first();
  },
  insertExpense(db, newExpense) {
    return db
      .insert(newExpense)
      .into("expense")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  deleteExpense(db, expense_id) {
    return db("expense")
      .where({ expense_id })
      .delete();
  },
  updateExpense(db, expense_id, newExpenseFields) {
    return db("expense")
      .where({ expense_id })
      .update(newExpenseFields);
  },
};
const categoryFields = [
  "cat.category_id AS cateogry:category_id",
  "cat.category_year AS category:category_year",
  "cat.category_name AS category:category_name",
  "cat.monthly_max AS category:monthly_max",
  "cat.budget_id AS category:budget_id"
];


module.exports = ExpenseService;
