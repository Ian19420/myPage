var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next)
{
  res.render('breakoutClone/index');
});
module.exports = router;