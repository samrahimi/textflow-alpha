var express = require('express');
var router = express.Router();
var config = require('../lib/config')
/* GET users placeholder. */
router.get('/', function(req, res, next) {
  res.send({users:[]});
});

router.get('/:user_id/scores/:timeframe', function(req, res, next) {
  //Return scores for one user over a specific timeframe
});


router.get('/config/:section', function(req, res, next) {
  res.send(config.getString(req.params.section))
});

module.exports = router;
