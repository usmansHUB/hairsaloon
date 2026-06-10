import { validationResult } from 'express-validator';

/**
 * Reusable validation middleware — runs the given express-validator rules
 * and returns a 400 with the first error message if any fail.
 */
export const validate = (rules) => async (req, res, next) => {
  await Promise.all(rules.map((rule) => rule.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};
