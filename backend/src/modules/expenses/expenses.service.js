import { prisma } from '../../config/db.js';

export const getExpenses = async (userId, { category, startDate, endDate, page = 1, limit = 10 } = {}) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = limit === 'all' ? undefined : Math.max(1, parseInt(limit, 10) || 10);

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
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.date.lte = end;
    }
  }

  const findOptions = {
    where,
    orderBy: { date: 'desc' },
  };

  if (limitNum !== undefined) {
    findOptions.skip = (pageNum - 1) * limitNum;
    findOptions.take = limitNum;
  }

  const [expenses, total] = await Promise.all([
    prisma.expense.findMany(findOptions),
    prisma.expense.count({ where }),
  ]);

  const formattedExpenses = expenses.map((exp) => ({
    ...exp,
    amount: Number(exp.amount),
    description: exp.note || '',
  }));

  return {
    data: formattedExpenses,
    total,
    page: pageNum,
    limit: limitNum || total,
  };
};

export const createExpense = async (userId, data) => {
  const noteText = (data.note || data.description || '').trim();
  const created = await prisma.expense.create({
    data: {
      userId,
      category: data.category.trim(),
      amount: Number(data.amount),
      date: new Date(data.date),
      note: noteText || null,
    },
  });

  return {
    ...created,
    amount: Number(created.amount),
    description: created.note || '',
  };
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

  const noteText = (data.note || data.description || '').trim();
  const updated = await prisma.expense.update({
    where: { id: expenseId },
    data: {
      category: data.category.trim(),
      amount: Number(data.amount),
      date: new Date(data.date),
      note: noteText || null,
    },
  });

  return {
    ...updated,
    amount: Number(updated.amount),
    description: updated.note || '',
  };
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
