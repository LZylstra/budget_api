const express = require("express");
const logger = require("../middleware/logger");
const xss = require("xss");
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");
const BillService = require("./bill-service");
const BillRouter = express.Router();

const serializeBill = (bill) => ({
  bill_id: bill.bill_id,
  bill_name: xss(bill.bill_name),
  bill_cost: bill.bill_cost,
  bill_due_date: bill.bill_due_date,
  current_status: bill.current_status,
  budget_id: bill.budget_id
});

// Get all bills
BillRouter.route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    BillService.getAllBills(req.app.get("db"))
      .then((bills) => {
        res.json(bills.map(serializeBill));
      })
      .catch(next);
  });

// Get all bills for a given budget 
BillRouter.route("/budget/:budget_id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { budget_id } = req.params;
    BillService.getAllBudgetBills(req.app.get("db"), budget_id)
      .then((bills) => {
        if (!bills) {
          logger.error(`Bill with budget id ${budget_id} not found.`);
          return res.status(404).json({
            error: { message: `Bill not found` },
          });
        }
        res.json(bills.map(serializeBill));
      })
      .catch(next);
  })

  // Add a new bill
  .post(bodyParser, (req, res, next) => {
    const {
      bill_name,
      bill_cost,
      bill_due_date,
      current_status,
      
    } = req.body;
    const { budget_id } = req.params;

    const newBill = {
        bill_name,
        bill_cost,
        bill_due_date,
        current_status,
        budget_id
    };

    if (!req.body.bill_name) {
      logger.error(`Bill name is required`);
      return res.status(400).send(`'bill_name' is required`);
    }

    if (!req.body.bill_cost) {
      logger.error(`Bill cost is required`);
      return res.status(400).send(`'bill_cost' is required`);
    }
    if (!req.body.bill_due_date) {
      logger.error(`Bill due date is required`);
      return res.status(400).send(`'bill_due_date' is required`);
    }

    BillService.insertBill(req.app.get("db"), newBill)
      .then((bill) => {
        res.status(201).location(`/`).json(serializeBill(bill));
      })
      .catch(next);
  });

// Get bill by id
BillRouter.route("/:bill_id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { bill_id } = req.params;
    BillService.getById(req.app.get("db"), bill_id)
      .then((bill) => {
        if (!bill) {
          logger.error(`Bill with id ${bill_id} not found.`);
          return res.status(404).json({
            error: { message: `Bill Not Found` },
          });
        }
        res.json(serializeBill(bill));
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { bill_id } = req.params;
    let {
        bill_name,
        bill_cost,
        bill_due_date,
        current_status,
        budget_id
    } = req.body;

    const updatedBill = {
        bill_name,
        bill_cost,
        bill_due_date,
        current_status,
        budget_id
    };


    BillService.updateBill(req.app.get("db"), bill_id, updatedBill)
      .then((bill) => {
        if (!bill) {
          logger.error(`Bill with id ${bill_id} not found.`);
          return res.status(404).json({
            error: { message: `Bill Not Found` },
          });
        }
        res.status(201).location(`/`).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { bill_id } = req.params;

    BillService.deleteBill(req.app.get("db"), bill_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch((err) => {
        console.log(err).next();
      });
  });

module.exports = BillRouter;
