var mongoose=require('mongoose');

//使用者模型
const userSchema=new mongoose.Schema(
    {
        username: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        profilePicture: String
    }
);
const User=mongoose.model('users',userSchema);

//物件模型
const msgSchema= new mongoose.Schema(
    {
        username: String,
        content: String,
    }
);
const Msg=mongoose.model('msgs',msgSchema);

module.exports=
{
    User,
    Msg
};