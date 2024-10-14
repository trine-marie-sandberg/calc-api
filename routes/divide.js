var express = require('express');
var router = express.Router();

router.get('/:number1/:number2', function(req, res, next) {
  res.status(200).json(parseInt(req.params.number1) / parseInt(req.params.number2));
});

module.exports = router;