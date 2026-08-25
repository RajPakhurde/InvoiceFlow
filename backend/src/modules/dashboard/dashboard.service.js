import { prisma } from '../../config/db.js';

export const getSummary = async (userId) => {
  const [outstandingAgg, paidAgg, expensesAgg, countsGroup] = await Promise.all([
    prisma.invoice.aggregate({
      _sum: { total: true },
      where: {
        userId,
        status: { in: ['sent', 'overdue'] },
      },
    }),
    prisma.invoice.aggregate({
      _sum: { total: true },
      where: {
        userId,
        status: 'paid',
      },
    }),
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: { userId },
    }),
    prisma.invoice.groupBy({
      by: ['status'],
      _count: { status: true },
      where: { userId },
    }),
  ]);

  const totalOutstanding = outstandingAgg._sum.total || 0;
  const totalPaid = paidAgg._sum.total || 0;
  const totalExpenses = expensesAgg._sum.amount || 0;
  const netProfit = totalPaid - totalExpenses;

  const invoiceCounts = {
    draft: 0,
    sent: 0,
    paid: 0,
    overdue: 0,
  };

  countsGroup.forEach((item) => {
    if (invoiceCounts.hasOwnProperty(item.status)) {
      invoiceCounts[item.status] = item._count.status;
    }
  });

  return {
    totalOutstanding,
    totalPaid,
    totalExpenses,
    netProfit,
    invoiceCounts,
  };
};

export const getRevenueChart = async (userId) => {
  const monthsMap = new Map();
  const now = new Date();

  // Build continuous 12 months array up to current month
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const monthKey = `${year}-${month}`;
    const monthLabel = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

    monthsMap.set(monthKey, {
      month: monthKey,
      monthLabel,
      revenue: 0,
      expenses: 0,
    });
  }

  const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [paidInvoices, userExpenses] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        userId,
        status: 'paid',
        paidAt: { gte: startDate },
      },
      select: {
        total: true,
        paidAt: true,
      },
    }),
    prisma.expense.findMany({
      where: {
        userId,
        date: { gte: startDate },
      },
      select: {
        amount: true,
        date: true,
      },
    }),
  ]);

  paidInvoices.forEach((inv) => {
    if (inv.paidAt) {
      const monthKey = inv.paidAt.toISOString().slice(0, 7);
      if (monthsMap.has(monthKey)) {
        const entry = monthsMap.get(monthKey);
        entry.revenue += inv.total;
      }
    }
  });

  userExpenses.forEach((exp) => {
    if (exp.date) {
      const monthKey = exp.date.toISOString().slice(0, 7);
      if (monthsMap.has(monthKey)) {
        const entry = monthsMap.get(monthKey);
        entry.expenses += exp.amount;
      }
    }
  });

  return Array.from(monthsMap.values());
};
