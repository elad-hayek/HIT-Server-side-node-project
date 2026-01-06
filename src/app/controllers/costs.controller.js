const { createCost } = require("../services/costs.service");
const { AppError } = require("../../errors/app_error");

async function addCost(req, res, next) {
  try {
    const { description, category, userid, sum } = req.body;

    if (!description || !category || !userid || !sum) {
      throw new AppError("Missing required fields", 400);
    }

    const cost = await createCost({
      description,
      category,
      userid,
      sum,
    });

    res.status(201).json(cost);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addCost,
};
