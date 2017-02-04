var express = require('express');
var router = express.Router();
var config = require('../lib/config')
var mongo = require('../adaptors/mongo_storage')
/* GET users placeholder. */
router.get('/', function(req, res, next) {
  if (req.query.auth_token="neversaynever") {
    mongo.read_data("Users", {}, function(err, results){
      res.send(req.query.pretty == "true" ? "<pre>"+JSON.stringify(results, null, 2)+"</pre>" : results)
    })
  }
  else
  {
    res.send([]);
  }
});

router.get('/:user_id/results/', function(req, res, next) {
   //TODO, get user too
   mongo.read_data("Results", {user_id:req.params.user_id}, function(err, results){
     if (!err && results!= null) {
      //var sorted = results.sort((a, b) => b.date - a.date)
      var sorted = results.sort((a, b) =>  a.date - b.date)
      //TODO: paging, etc

      if (req.query.format == "dataset") {
          var group = parseInt(req.query.group) //0 for emotions, 1 for personality, 2 for other
          var filtered = sorted.map((x) => ({date: x.date, results: x.user_scores[group].info}))
          var dset = []
          filtered.forEach(function(f){
              var row = []
              if (typeof f.date !== Date)
                row.push(new Date(f.date).getDate().toString())
              else 
                row.push(f.date.getDate().toString())

              f.results.forEach(function(r){
                row.push(r.score)
            })
            dset.push(row)              
          })
          res.contentType("application/json")
          res.send(dset)
      } 
      else {
        res.send(sorted)
      }
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
