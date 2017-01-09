var express = require('express');
var router = express.Router();
var config = require('../lib/config')
var engine = require('../adaptors/'+config.adaptors.engine)


/* Text submitted. */
router.post('/', function(req, res, next) {
  var userId = req.params.userId
  var message = req.body.message
  var source = req.params.source
  var meta = req.params.meta

  console.log("message is "+message)
  /* Initialize the AI engine with credentials */ 
  engine.init(config.credentials[config.adaptors.engine])
  /* Request text analysis from AI engine (offsite) */
  engine.evaluate(message, function(msg, analysis){
    res.send(analysis)  
  })
});

module.exports = router;
