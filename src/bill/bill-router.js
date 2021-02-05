const express = require("express");
const logger = require("../middleware/logger");
const xss = require("xss");
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");
const BillService = require("./bill-service");
const BillRouter = express.Router();

const serializeBill = (bill) => ({
  id: bill.id,
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
BillRouter.route("/budget/:budgetid")
  .all(requireAuth)
  .get((req, res, next) => {
    const { budgetid } = req.params;
    BillService.getAllUserHabits(req.app.get("db"), budgetid)
      .then((bills) => {
        if (!bills) {
          logger.error(`Bill with budget id ${budgetid} not found.`);
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
      budget_id
    } = req.body;
    const { user_id } = req.params;
    const newBill = {
        bill_name,
        bill_cost,
        bill_due_date,
        current_status,
        budget_id,
        user_id
    };

    if (!req.body.bill_name) {
      logger.error(`Bill name is required`);
      return res.status(400).send(`'bill_name' is required`);
    }

    BillService.insertBill(req.app.get("db"), newBill)
      .then((bill) => {
        res.status(201).location(`/`).json(serializeBill(bill));
      })
      .catch(next);
  });

// Get bill by id
BillRouter.route("/:id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { id } = req.params;
    BillService.getById(req.app.get("db"), id)
      .then((bill) => {
        if (!bill) {
          logger.error(`Bill with id ${id} not found.`);
          return res.status(404).json({
            error: { message: `Bill Not Found` },
          });
        }
        res.json(serializeBill(bill));
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { id } = req.params;
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


    BillService.updateBill(req.app.get("db"), id, updatedBill)
      .then((task) => {
        if (!task) {
          logger.error(`Bill with id ${id} not found.`);
          return res.status(404).json({
            error: { message: `Bill Not Found` },
          });
        }
        res.status(201).location(`/`).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { id } = req.params;

    BillService.deleteBill(req.app.get("db"), id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch((err) => {
        console.log(err).next();
      });
  });

module.exports = BillRouter;
