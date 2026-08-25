import * as expensesService from './expenses.service.js';

export const getExpensesHandler = async (req, res, next) => {
  try {
    const { category, startDate, endDate } = req.query;
    const expenses = await expensesService.getExpenses(req.user.id, {
      category,
      startDate,
      endDate,
    });
    res.status(200).json(expenses);
  } catch (error) {
    next(error);
  }
};

export const createExpenseHandler = async (req, res, next) => {
  try {
    const expense = await expensesService.createExpense(req.user.id, req.body);
    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};

export const updateExpenseHandler = async (req, res, next) => {
  try {
    const expense = await expensesService.updateExpense(req.user.id, req.params.id, req.body);
    res.status(200).json(expense);
  } catch (error) {
    next(error);
  }
};

export const deleteExpenseHandler = async (req, res, next) => {
  try {
    await expensesService.deleteExpense(req.user.id, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
