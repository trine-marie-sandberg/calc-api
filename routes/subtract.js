var express = require('express');
var router = express.Router();
var jsend = require('jsend');
router.use(jsend.middleware);

router.get('/:number1/:number2', function(req, res, next) {
  const result = parseInt(req.params.number1) - parseInt(req.params.number2);
  res.jsend.success(result);
});

module.exports = router;