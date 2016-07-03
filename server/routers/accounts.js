var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var Account = mongoose.model("Account");
var ObjectId = mongoose.Types.ObjectId;
var authUtils = require('../services/authUtils');
var requestUtils = require('../services/requestUtils');
var responseUtils = require('../services/responseUtils');
var surveyVerify = require('../services/surveyVerify');
var Promise = require("bluebird");
mongoose.Promise = Promise;

router.get('/', function(req, res, next) {
  var pagenation = requestUtils.getPagenation(req);
  var queryPromise = Account.find({}, {}, pagenation).exec();
  queryPromise.then(function(accounts) {
    if (accounts) {
      res.json(accounts);
    } else {
      responseUtils.resourcesNotFoundError(res);
    }
  }).catch(function(err) {
    responseUtils.internalError(res, err);
  });
});

//get the account by id
router.get('/:id', function(req, res, next) {
  var queryPromise = Account.findById(new ObjectId(req.params.id)).exec();
  queryPromise.then(function(account) {
    if (account) {
      res.json(account);
    } else {
      responseUtils.resourceNotFoundError(res, req.params.id);
    }
  }).catch(function(err) {
    responseUtils.internalError(res, err);
  });
});
//create an account
router.post('/', function(req, res, next) {
  var accountModel = new Account(req.body);
  accountModel.save().then(function(account) {
    res.json(account);
  }).catch(function(err) {
    responseUtils.internalError(res, err);
  });
});

// update the account by id
router.put('/:id', function(req, res, next) {
  var accountModel = new Account(req.body);
  var updatePromise = Account.findByIdAndUpdate(new ObjectId(req.params.id), accountModel).exec();
  updatePromise.then(function(account) {
    if (account) {
      res.json(account);
    } else {
      responseUtils.resourceNotFoundError(res, req.params.id);
    }
  }).catch(function(err) {
    responseUtils.internalError(res, err);
  });

});

//delete by id
router.delete('/:id', function(req, res, next) {
  Account.findByIdAndRemove(new Object(req.params.id)).then(function(account) {
    responseUtils.deletedSuccessfully(res, req.params.id)
  }).catch(function(err) {
    responseUtils.internalError(res, err);
  });
});


router.post('/authenticate', function(req, res, next) {
  var account = req.body;
  if (account.id !== undefined) {
    var token = authUtils.generateToken(account);
    res.json({
      userToken: token
    });
  } else {
    var error = new Error();
    error.message = "please provided your ID";
    error.code = 400;
    responseUtils.badRequestError(res, error);
  }

});


router.post('/register', function(req, res, next) {
  res.json(req.body);
});

module.exports = router;
