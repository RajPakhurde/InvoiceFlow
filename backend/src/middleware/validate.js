export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    const issue = err.errors?.[0];
    const message = issue ? `${issue.path.join('.')}: ${issue.message}` : 'Validation error';

    return res.status(400).json({
      error: {
        message,
        code: 'VALIDATION_ERROR',
      },
    });
  }
};
