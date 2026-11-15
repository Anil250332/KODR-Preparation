export const validate = (schema) => (req, res, next) => {
  try {
    if (schema.body) {
      req.body = schema.body.parse(req.body);
    }
    if (schema.params) {
      req.params = schema.params.parse(req.params);
    }
    if (schema.query) {
      req.query = schema.query.parse(req.query);
    }
    if (schema.parse && !schema.body && !schema.params && !schema.query) {
      req.body = schema.parse(req.body);
    }
    next();
  } catch (error) {
    next(error);
  }
};
