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

export const getRevenueChart = async (userId, period = '12months') => {
  const now = new Date();
  const timeMap = new Map();
  let startDate;

  if (period === '30days') {
    // 30 Days continuous timeline
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const key = `${year}-${month}-${day}`;
      const monthLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      timeMap.set(key, {
        month: key,
        monthLabel,
        revenue: 0,
        expenses: 0,
      });
    }
  } else if (period === 'yearly') {
    // 5 Years continuous timeline
    const currentYear = now.getFullYear();
    startDate = new Date(currentYear - 4, 0, 1);
    for (let i = 4; i >= 0; i--) {
      const year = currentYear - i;
      const key = String(year);

      timeMap.set(key, {
        month: key,
        monthLabel: key,
        revenue: 0,
        expenses: 0,
      });
    }
  } else {
    // 12 Months continuous timeline (default)
    startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const key = `${year}-${month}`;
      const monthLabel = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

      timeMap.set(key, {
        month: key,
        monthLabel,
        revenue: 0,
        expenses: 0,
      });
    }
  }

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
      let key;
      if (period === '30days') {
        key = inv.paidAt.toISOString().slice(0, 10);
      } else if (period === 'yearly') {
        key = String(inv.paidAt.getFullYear());
      } else {
        key = inv.paidAt.toISOString().slice(0, 7);
      }

      if (timeMap.has(key)) {
        const entry = timeMap.get(key);
        entry.revenue += inv.total;
      }
    }
  });

  userExpenses.forEach((exp) => {
    if (exp.date) {
      let key;
      if (period === '30days') {
        key = exp.date.toISOString().slice(0, 10);
      } else if (period === 'yearly') {
        key = String(exp.date.getFullYear());
      } else {
        key = exp.date.toISOString().slice(0, 7);
      }

      if (timeMap.has(key)) {
        const entry = timeMap.get(key);
        entry.expenses += exp.amount;
      }
    }
  });

  return Array.from(timeMap.values());
};
