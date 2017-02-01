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
     var sorted = results.sort((a, b) => b.date - a.date)
     //TODO: paging, etc
     res.send(sorted)
   })
});


router.get('/config/:section', function(req, res, next) {
  res.send(config.getString(req.params.section))
});

module.exports = router;
