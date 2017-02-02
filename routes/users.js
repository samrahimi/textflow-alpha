var express = require('express');
var router = express.Router();
var config = require('../lib/config')
var mongo = require('../adaptors/mongo_storage')
/* GET users placeholder. */
router.get('/', function(req, res, next) {
  res.send({users:[]});
});

router.get('/:user_id/results/', function(req, res, next) {
   //TODO, get user too
   mongo.read_data("Results", {user_id:req.params.user_id}, function(err, results){
     if (!err && results!= null) {
     var sorted = results.sort((a, b) => b.date - a.date)
     //TODO: paging, etc
     res.send(sorted)
     }
     else
     {
       res.send([])
     }
   })
});

router.get('/signup', function(req, res, next){
  var user = {
    first_name: req.query.first_name,
    last_name: req.query.last_name,
    email: req.query.email,
    password: req.query.password
  }
  mongo.read_data("Users", {email:user.email}, function(err, result){
    if (result && result._id) {
      res.send({error:"User already exists"})
    }
    else {
      mongo.write_data("Users", user, function(err, newUser){
        if (newUser && newUser._id) {
          res.send(newUser)
        } else {
          res.send({error: err})
        }
      })
    }
  })
})

router.get('/login', function(req, res, next){
  var creds = {
    email: req.query.email,
    password: req.query.password
  }
  mongo.read_data("Users", {email:creds.email, password:creds.password}, function(err, result){
    if (result && result._id) {
      res.send(result)
    } else {
      res.send({error: "Login incorrect"})
    }
  })
})


router.get('/config/:section', function(req, res, next) {
  res.send(config.getString(req.params.section))
});

module.exports = router;
