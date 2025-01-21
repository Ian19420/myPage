var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next)
{
  res.render('board/index');
});
//註冊
router.get('/register',function(req,res,next)
{
  res.render('board/register');
});
//登入
router.get('/login',function(req,res,next)
{
  res.render('board/login');
});
module.exports = router;
