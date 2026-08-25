import { prisma } from '../../config/db.js';

export const getExpenses = async (userId, { category, startDate, endDate } = {}) => {
  const where = { userId };

  if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
    where.category = category.trim();
  }

  if (startDate || endDate) {
    where.date = {};
    if (startDate) {
      where.date.gte = new Date(startDate);
    }
    if (endDate) {
      // Set end of day for inclusive date filtering
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.date.lte = end;
    }
  }

  return await prisma.expense.findMany({
    where,
    orderBy: { date: 'desc' },
  });
};

export const createExpense = async (userId, data) => {
  return await prisma.expense.create({
    data: {
      userId,
      category: data.category.trim(),
      amount: Number(data.amount),
      date: new Date(data.date),
      note: data.note ? data.note.trim() : null,
    },
  });
};

export const updateExpense = async (userId, expenseId, data) => {
  const existing = await prisma.expense.findFirst({
    where: { id: expenseId, userId },
  });

  if (!existing) {
    const error = new Error('Expense not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  return await prisma.expense.update({
    where: { id: expenseId },
    data: {
      category: data.category.trim(),
      amount: Number(data.amount),
      date: new Date(data.date),
      note: data.note ? data.note.trim() : null,
    },
  });
};

export const deleteExpense = async (userId, expenseId) => {
  const existing = await prisma.expense.findFirst({
    where: { id: expenseId, userId },
  });

  if (!existing) {
    const error = new Error('Expense not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  await prisma.expense.delete({
    where: { id: expenseId },
  });

  return { success: true };
};
