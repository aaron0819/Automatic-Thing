var request = require('request'); 
var express = require('express');
var router = express.Router();

router.trips = function(req, res, next) { request.get({
      uri: "https://api.automatic.com/trip/",
      headers: {Authorization: 'Bearer ' + req.session.token.token.access_token},
      json: true
    }, function(e, r, body) {
      if(e){
        next(e);
      } else{
        trip = body.results;
      }
      
    });
  }

router.users = function(req, res, next) { request.get({
      uri: "https://api.automatic.com/user/me/",
      headers: {Authorization: 'Bearer ' + req.session.token.token.access_token},
      json: true
    }, function(e, r, body) {
      if(e){
        next(e);
      } else{
        user = body;
      }
      
    });
  }
router.vehicles = function(req, res, next) { request.get({
      uri: "https://api.automatic.com/vehicle/1/",
      headers: {Authorization: 'Bearer ' + req.session.token.token.access_token},
      json: true
    }, function(e, r, body) {
      if(e){
        next(e);
      } else{
        vehicle = body;
      }
      
    });
  }

module.exports = router;