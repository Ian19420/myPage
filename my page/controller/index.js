var bcrypt=require('bcrypt');
function register(Entity, params, req, res)
{
    const saltRounds = 10;
    bcrypt.hash(params.password, saltRounds, (err, hash)=>
    {
        if (err) return res.status(500).json({ error: '哈希密碼時出錯' });
        params.password = hash;
        Entity.create(params).then(rel=>
        {
            if (rel)
            {
                return res.json({ message: '註冊成功!' });
            } 
            else
            {
                return res.status(400).json({ error: '註冊失敗!' });
            }
        })
        .catch(err=>
        {
            return res.status(500).json({ error: '異常(名稱重複...)' });
        });
    });
}

function findUser(Entity,username,password,req,res)
{
    Entity.findOne({username:username}).then(rel=>
    {
        if (!rel) return res.status(404).json({ error: '使用者不存在' });
        bcrypt.compare(password, rel.password).then(isMatch=>
        {
            if (isMatch)
            {
                req.session.username = rel.username;
                return res.json({ message: '登入成功' });
            }
            else return res.status(401).json({ error: '密碼錯誤' });
        });
    }).catch(err=>
    {
        console.error(err);
        return res.status(500).json({ error: '伺服器錯誤' });
    });
}
function postMsg(Entity,params,res)
{
    Entity.create(params).then(rel=>
    {
        if(rel) return res.json({ message: '張貼成功' });
        else return res.status(401).json({ error: '張貼失敗' });
    }).catch(err=>
    {
        console.error(err);
        return res.status(500).json({ error: '伺服器錯誤' });
    })
}
function findAllContent(Entity, res)
{
    Entity.find().then(rel=>
    {
        if (rel && rel.length > 0)
        {
            return res.json({ message: '成功', data: rel });
        } else
        {
            return res.status(404).json({ error: '没有找到任何内容' });
        }
    }).catch(err=>
    {
        console.error(err);
        return res.status(500).json({ error: '伺服器錯誤' });
    });
}
module.exports=
{
    register,
    findUser,
    postMsg,
    findAllContent
};