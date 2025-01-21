var mongoose=require('mongoose');
function getConnect()
{
    mongoose.connect('mongodb://localhost/board')
    .then(()=>console.log('資料庫連接成功'))
    .catch(err=>console.log('資料庫連接失敗',err));
}
module.exports=getConnect;