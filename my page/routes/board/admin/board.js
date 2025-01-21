var express=require('express');
var router=express.Router();
var model=require('../../../model');
var ctl=require('../../../controller');

//註冊
router.post('/register',function(req,res)
{
  const params=req.body;
  ctl.register(model.User,params,req,res);
});
//登入
router.post('/login',function(req,res)
{
  const {username,password}=req.body;
  ctl.findUser(model.User,username,password,req,res);
});
router.get('/main',function(req,res)
{
  res.render('board/admin/main',{username:req.session.username});
});
router.post('/post',function(req,res)
{
  const params=req.body;
  ctl.postMsg(model.Msg,params,res);
});
router.get('/content',function(req,res)
{
  ctl.findAllContent(model.Msg,res);
});
module.exports=router;