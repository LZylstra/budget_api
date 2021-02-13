const express = require("express");
const logger = require("../middleware/logger");
const xss = require("xss");
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");
const SavingsService = require("./savings-service");
const SavingsRouter = express.Router();

const serializeSavings = (savings) => ({
  savings_id: savings.savings_id,
  savings_name: xss(savings.savings_name),
  savings_amount: savings.savings_amount,
  goal_date: savings.goal_date,
  goal_amount: savings.goal_amount,
  monthly_auto: savings.monthly_auto,
  budget_id: savings.budget_id
});

// Get all savings
SavingsRouter.route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    SavingsService.getAllSavings(req.app.get("db"))
      .then((savings) => {
        res.json(savings.map(serializeSavings));
      })
      .catch(next);
  });

// Get all savings for a given budget 
SavingsRouter.route("/budget/:budget_id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { budget_id } = req.params;
    SavingsService.getAllBudgetSavings(req.app.get("db"), budget_id)
      .then((savings) => {
        if (!savings) {
          logger.error(`Savings with budget id ${budget_id} not found.`);
          return res.status(404).json({
            error: { message: `Savings not found` },
          });
        }
        res.json(savings.map(serializeSavings));
      })
      .catch(next);
  })

  // Add a new savings
  .post(bodyParser, (req, res, next) => {
    const {
      savings_name,
      savings_amount,
      goal_date,
      goal_amount,
      monthly_auto
      
    } = req.body;
    const { budget_id } = req.params;

    const newSavings = {
        savings_name,
        savings_amount,
        goal_date,
        goal_amount,
        monthly_auto,
        budget_id
    };

    if (!req.body.savings_name) {
      logger.error(`Savings name is required`);
      return res.status(400).send(`'savings_name' is required`);
    }

    if (!req.body.goal_date) {
      logger.error(`Goal date is required`);
      return res.status(400).send(`'goal_date' is required`);
    }

    SavingsService.insertSavings(req.app.get("db"), newSavings)
      .then((savings) => {
        res.status(201).location(`/`).json(serializeSavings(savings));
      })
      .catch(next);
  });

// Get savings by id
SavingsRouter.route("/:savings_id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { savings_id } = req.params;
    SavingsService.getById(req.app.get("db"), savings_id)
      .then((savings) => {
        if (!savings) {
          logger.error(`Savings with id ${savings_id} not found.`);
          return res.status(404).json({
            error: { message: `Savings Not Found` },
          });
        }
        res.json(serializeSavings(savings));
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { savings_id } = req.params;
    let {
        savings_name,
        savings_amount,
        goal_date,
        goal_amount,
        monthly_auto,
        budget_id
    } = req.body;

    const updatedSavings = {
        savings_name,
        savings_amount,
        goal_date,
        goal_amount,
        monthly_auto,
        budget_id
    };


    SavingsService.updateSavings(req.app.get("db"), savings_id, updatedSavings)
      .then((savings) => {
        if (!savings) {
          logger.error(`Savings with id ${savings_id} not found.`);
          return res.status(404).json({
            error: { message: `Savings Not Found` },
          });
        }
        res.status(201).location(`/`).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { savings_id } = req.params;

    SavingsService.deleteSavings(req.app.get("db"), savings_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch((err) => {
        console.log(err).next();
      });
  });

module.exports = SavingsRouter;
