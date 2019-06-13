var express = require('express');
var router = express.Router();

const providerCont = require('../controllers/provider-userCont');


router.get('/', providerCont.getUser );

router.post('/register', providerCont.addUser);

router.post('/login', providerCont.loginUser);

router.post('/post',TokenVerfy, providerCont.post );

router.get('/getpost',providerCont.getPost);

router.get('/appliedpostusers', TokenVerfy, providerCont.usersdata);

router.delete('/deletePost/:_id',TokenVerfy,providerCont.deletePost);

router.get('/getComPost',TokenVerfy,providerCont.ComPost);

router.delete('/deletePost/:_id',TokenVerfy,providerCont.deletePost);

router.post('/search',providerCont.search);

function TokenVerfy(req,res,next)
{
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== undefined)
    {
        
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token=bearerToken;
        console.log("rfegretetvf");
        next();
    }
    else{
        console.log("err");
        res.json({"status":403,msg: {str1:'Authentication Failed', str2: ''}})
    }
}



module.exports = router;
