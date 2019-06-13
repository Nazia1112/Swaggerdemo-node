var express = require('express');
var router = express.Router();

const userCont = require('../controllers/userCont');


router.get('/', userCont.getUser);
/**
 * @swagger
 * definitions:
 *   Users:
 *     properties:
 *       firstname:
 *         type: string
 *       lastname:
 *         type: string
 *       username:
 *         type: string
 *       password:
 *         type: string
 *       address:
 *         type: string
 *       email:
 *         type: string
 *       phone:
 *         type: number
 *       location:
 *         type: string       
 */


 /**
 * @swagger
 * /users/register:
 *   post:
 *     tags:
 *       - User
 *     description: Register Users
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: new User
 *         description: In this, register the user using the first name, last name, username, email id, password, address, phone and location.
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Users'
 *     responses:
 *       200:
 *         description: Successfully created
 *       409:
 *         description: User exists
 */


router.post('/register', userCont.addUser);


/**
 * @swagger
 * definitions:
 *   LoginUser:
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string      
 */

  /**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - User
 *     description: Login User
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: exisiting User
 *         description: In this, login user using the username and password
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/LoginUser'
 *     responses:
 *       200:
 *         description: Successfully loggedin
 *       402:
 *         description: User not found
 *       403:
 *         description: Username or password don't match
 */


router.post('/login', userCont.loginUser);

router.post('/addResume', TokenVerfy, userCont.addResume);

router.post('/addFile', userCont.addFile);

router.post('/applyPost', TokenVerfy, userCont.applyPost);



/**
 * @swagger
 * /users/userprofile:
 *   get:
 *     security:
 *       - bearerAuth:[]
 *     tags:
 *       - User
 *     description: Returns a single User
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         description: After Login, token is generated then pass that token in the authorization input.
 *         in: header
 *         required: true
 *         type: string 
 *     responses:
 *       200:
 *         description: 'Will send `Authenticated`'
 *       400:
 *         description: 'Need Permission'
 */

router.get('/userprofile', TokenVerfy, userCont.userprofile);

function TokenVerfy(req, res, next) {
    console.log(req.headers);
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== undefined) {
        console.log(bearerHeader, "bearerHeader");

        req.token = bearerHeader;
        console.log("rfegretetvf", req.token);
        next();
    }
    else {
        console.log("err");
        res.json({ "status": 403, msg: { str1: 'Authentication Failed', str2: '' } })
    }
}



module.exports = router;



