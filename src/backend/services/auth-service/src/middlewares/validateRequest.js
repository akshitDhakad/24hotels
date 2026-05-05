/**
 * @param {import('joi').ObjectSchema} schema
 * @param {'body'|'query'|'params'} source
 */
function validateRequest(schema, source = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map((d) => d.message),
        correlationId: req.correlationId,
      });
    }
    req[source] = value;
    return next();
  };
}

module.exports = { validateRequest };
