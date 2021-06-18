const express = require("express");
const logger = require("../middleware/logger");
const xss = require("xss");
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");
const CategoryService = require("./category-service");
const CategoryRouter = express.Router();

const serializeCategory = (category) => ({
  category_id: category.category_id,
  category_name: xss(category.category_name),
  category_year: xss(category.category_year),
  monthly_max: category.monthly_max,
  budget_id: category.budget_id
});

// Get all categories
CategoryRouter.route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    CategoryService.getAllCategories(req.app.get("db"))
      .then((categorys) => {
        res.json(categorys.map(serializeCategory));
      })
      .catch(next);
  });

// Get all categorys for a given budget 
CategoryRouter.route("/budget/:budget_id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { budget_id } = req.params;
    CategoryService.getAllBudgetCategories(req.app.get("db"), budget_id)
      .then((categorys) => {
        if (!categorys) {
          logger.error(`Category with budget id ${budget_id} not found.`);
          return res.status(404).json({
            error: { message: `category not found` },
          });
        }
        res.json(categorys.map(serializeCategory));
      })
      .catch(next);
  })

  // Add a new category
  .post(bodyParser, (req, res, next) => {
    const {
        category_name,
        category_year,
        monthly_max,
    } = req.body;
    const { budget_id } = req.params;
    const newCategory = {
        category_name,
        category_year,
        monthly_max,
        budget_id
    };

    if (!req.body.category_name) {
      logger.error(`category name is required`);
      return res.status(400).send(`'category_name' is required`);
    }

    if (!req.body.category_year) {
        logger.error(`category year is required`);
        return res.status(400).send(`'category_year' is required`);
      }
  

    CategoryService.insertCategory(req.app.get("db"), newCategory)
      .then((category) => {
        res.status(201).location(`/`).json(serializeCategory(category));
      })
      .catch(next);
  });

// Get category by id
CategoryRouter.route("/:category_id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { category_id } = req.params;
    CategoryService.getById(req.app.get("db"), category_id)
      .then((category) => {
        if (!category) {
          logger.error(`category with id ${category_id} not found.`);
          return res.status(404).json({
            error: { message: `Category Not Found` },
          });
        }
        res.json(serializeCategory(category));
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { category_id } = req.params;
    let {
        category_name,
        category_year,
        monthly_max,
        budget_id
    } = req.body;

    const updatedCategory = {
        category_name,
        category_year,
        monthly_max,
        budget_id
    };


    CategoryService.updateCategory(req.app.get("db"), category_id, updatedCategory)
      .then((category) => {
        if (!category) {
          logger.error(`category with id ${category_id} not found.`);
          return res.status(404).json({
            error: { message: `Category Not Found` },
          });
        }
        res.status(201).location(`/`).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { category_id } = req.params;

    CategoryService.deleteCategory(req.app.get("db"), category_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch((err) => {
        console.log(err).next();
      });
  });

module.exports = CategoryRouter;
