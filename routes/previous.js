var express = require('express');
var jsend = require('jsend');
var router = express.Router();
var db = require("../models");
var ResultService = require("../services/ResultService")
var resultService = new ResultService(db);
var jwt = require('jsonwebtoken')

router.use(jsend.middleware);
router.get('/add/:number1', async function(req, res, next) {
    const number1 = parseInt(req.params.number1);
    if(isNaN(number1)) {
        return res.jsend.fail({"number1": "number1 is not in correct format"});
    }
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
        return res.jsend.fail({"result": "JWT token not provided"});
    }
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET );
    if (decodedToken == null) {
        return res.jsend.fail({"result": "JWT token is invalid"});
    }
    const previous = await resultService.getOne(decodedToken.id);
    const result = previous.Value + number1;
    resultService.create("add", result, decodedToken.id);
    res.jsend.success({"result": result, "previousOperation": previous.OperationName, "previousValue": previous.Value});
});

router.get('/subtract/:number1', async function(req, res, next) {
    const number1 = parseInt(req.params.number1);
    if(isNaN(number1)) {
        return res.jsend.fail({"number1": "number1 is not in correct format"});
    }
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
        return res.jsend.fail({"result": "JWT token not provided"});
    }
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET );
    if (decodedToken == null) {
        return res.jsend.fail({"result": "JWT token is invalid"});
    }
    const previous = await resultService.getOne(decodedToken.id);
    const result = previous.Value - number1;
    resultService.create("subtract", result, decodedToken.id);
    res.jsend.success({"result": result, "previousOperation": previous.OperationName, "previousValue": previous.Value});
});

router.get('/multiply/:number1', async function(req, res, next) {
    const number1 = parseInt(req.params.number1);
    if(isNaN(number1)) {
        return res.jsend.fail({"number1": "number1 is not in correct format"});
    }
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
        return res.jsend.fail({"result": "JWT token not provided"});
    }
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET );
    if (decodedToken == null) {
        return res.jsend.fail({"result": "JWT token is invalid"});
    }
    const previous = await resultService.getOne(decodedToken.id);
    const result = previous.Value * number1;
    resultService.create("multiply", result, decodedToken.id);
    res.jsend.success({"result": result, "previousOperation": previous.OperationName, "previousValue": previous.Value});
});

router.get('/divide/:number1', async function(req, res, next) {
    const number1 = parseInt(req.params.number1);
    if(isNaN(number1)) {
        return res.jsend.fail({"number1": "number1 is not in correct format"});
    }
    if(number1 == 0) {
        return res.jsend.fail({"number1": "number1 cannot be 0"});
    }
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
        return res.jsend.fail({"result": "JWT token not provided"});
    }
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET );
    if (decodedToken == null) {
        return res.jsend.fail({"result": "JWT token is invalid"});
    }
    const previous = await resultService.getOne(decodedToken.id);
    const result = previous.Value / number1;
    resultService.create("divide", Math.round(result), decodedToken.id);
    if (Number.isInteger(result)) {
        res.jsend.success({"result": result, "previousOperation": previous.OperationName, "previousValue": previous.Value});
    }
    else {
        res.jsend.success({"result": Math.round(result), "previousOperation": previous.OperationName, "previousValue": previous.Value, "message": "Result has been rounded, as it was not an integer."});
    }
});

module.exports = router;