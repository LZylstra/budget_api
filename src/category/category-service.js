const xss = require("xss");

const CategoryService = {
  getAllCategories(db) {
    return db.select("*").from("category");
  },
  getAllBudgetCategories(db, category_id) {
    return db
      .from("category AS c")
      .select(
        "c.category_id",
        "c.category_name",
        "c.expense_year",
        "c.monthly_max",
        "c.budget_id",
        ...budgetFields
      )
      .leftJoin("budget  AS bud", "c.budget_id", "bud.budget_id")
      .where("bud.budget_id", category_id);
  },
  getById(db, category_id) {
    return db
      .from("category")
      .select("*")
      .where("category.category_id", category_id)
      .first();
  },
  insertCategory(db, newCategory) {
    return db
      .insert(newCategory)
      .into("category")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  deleteCategory(db, category_id) {
    return db("category")
      .where({ category_id })
      .delete();
  },
  updateCategory(db, category_id, newCategoryFields) {
    return db("category")
      .where({ category_id })
      .update(newCategoryFields);
  },
};
const budgetFields = [
  "bud.budget_id AS budget:budget_id",
  "bud.user_id AS budget:user_id",
  "bud.monthly_pay AS budget:monthly_pay",
  "bud.additional_income AS budget:additional_income"
];


module.exports = CategoryService;
