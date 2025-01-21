var express=require('express');
var router=express.Router();
var multer=require('multer');
var fs=require('fs');
var path=require('path');
//使用表單上傳
var upload=multer(
{
    storage: multer.diskStorage(
    {
        //設定檔案儲存位置
        destination:function(req,file,cb)
        {
            let date=new Date();
            let year=date.getFullYear();
            let month=(date.getMonth()+1).toString().padStart(2,'0'); //格式化為2位數字符串
            let day=date.getDate();
            let dir='./public/uploads/'+year+month+day;
            
            if(!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true}); //沒有則建立
            cb(null,dir);
        },
        filename:function(req,file,cb)
        {
            let fileName=file.fieldname+'-'+Date.now()+path.extname(file.originalname);
            cb(null,fileName);
        }
    })
    
});
router.post('/file',upload.single('file'),function(req,res,next)
{
    let path=req.file.path;
    let imgurl=path.substring(path.indexOf('\\'));
    res.json(
    {
        imgurl
    });
});
module.exports=router;