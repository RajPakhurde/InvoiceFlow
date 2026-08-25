import * as dashboardService from './dashboard.service.js';

export const getSummaryHandler = async (req, res, next) => {
  try {
    const summary = await dashboardService.getSummary(req.user.id);
    res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
};

export const getRevenueChartHandler = async (req, res, next) => {
  try {
    const chartData = await dashboardService.getRevenueChart(req.user.id);
    res.status(200).json(chartData);
  } catch (error) {
    next(error);
  }
};
