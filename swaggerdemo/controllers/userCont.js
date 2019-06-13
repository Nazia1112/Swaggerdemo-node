const jwt = require('jsonwebtoken');
const User = require('../model/user');
var multer = require('multer');
var path = require('path');
const Resume = require('../model/resume');
const post = require('../model/post');
var mailer = require('./mailer');

module.exports.getUser = function (req, res, next) {
  User.find({})
    .then(users => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      // res.json(users);
      res.render('users', { users: users });
    }, (err) => next(err))
    .catch((err) => next(err));
};

module.exports.userprofile = function (req, res, next) {

  console.log(req.token, "fgdfgdfgdfgdf");
  
  
  jwt.verify(req.token, 'TopSecret', (err, authdata) => {
    if (err) {
      console.log(err);
      res.json({ "status": 403, msg: { str1: 'Session Expired or Unauthorized access', str2: '' } });
    }
    else {
      console.log(authdata,"agaya")
      User.find({ _id: authdata.UserId })
        .populate({ path: 'resume_id', model: 'nbResume' }, )
        .then((docs) => {
          console.log(docs)
          res.json({ status: 200, data: docs });
        })
        .catch(err => {
          res.send(err);
        });
    }
  });

}

module.exports.addUser = (req, res, next) => {
  console.log(req.body);
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user == null) {
        User.create(req.body)
          .then((user) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, msg: 'Successfull' });
            //res.render('users', {users: users});
          });
      }
      else {
        res.statusCode = 409;
        res.setHeader('Content-Type', 'application/json');
        res.json({ msg: "User " + req.body.firstname + " Exists" });
      }
    }, err => next(err));
};

module.exports.loginUser = (req, res) => {
  let searchname = req.body.username;
  let passwordname = req.body.password;
  console.log(req.body);


  User.findOne({ username: searchname, password: passwordname }, (err, obj) => {
    if (obj == null) {
      res.json({ "status": 404, msg: { str1: 'Incorrect Username or Password.', str2: 'User not found.' } });
    }
    else {

      jwt.sign({ UserId: obj._id }, 'TopSecret', { expiresIn: 60 * 60 }, (err, token) => {
        if (err) {
          res.send(err);
        }
        else {
          res.json({
            "status": 200, token: token, msg: {
              str1: 'Successfully LoggedIn',

            }
          });
        }
      });
    }
  });

};


const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
    let filename = file.originalname.split('.')[0] + '-' + Date.now() + '-' + 'jobPro' + path.extname(file.originalname);
    console.log(filename, "sdffd");

    callback(null, filename);
  }
});
// Multer function
var upload = multer({ storage: storage }).single('resume');

module.exports.addFile = function (req, res, next) {

  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      res.json({ data: null });
    }
    else {
      console.log(req.file.filename);
      res.json({ "status": 200, filename: req.file.filename, msg: { str1: 'SuccessFully Uploaded', str2: '' } });
    }
  });
}

module.exports.addResume = function (req, res) {

  console.log("hell0oo", req.token);
  jwt.verify(req.token, 'TopSecret', (err, authdata) => {
    if (err) {
      console.log(err);
      res.json({ "status": 403, msg: { str1: 'Authentication Failed', str2: '' } });
    }
    else {
      console.log(authdata, "authdata");
      req.body.userId = authdata.UserId;
      var resume = new Resume(req.body);

      resume.save((err, data) => {
        if (err) {
          console.log(err);
          res.json({ "status": 404, msg: { str1: 'Resume failed.', str2: '' } });
        }
        else {
          console.log("success");
          User.findOneAndUpdate({ _id: authdata.UserId }, { resume_id: data._id }, (err, data) => {
            if (err) {

            }
            else {


              res.json({
                "status": 200, msg: {
                  str1: 'Successfully Added',
                  str2: ''
                }
              });
            }
          })


        }
      })
    }
  })
}

module.exports.applyPost = function (req, res, next) {
  console.log("hello");
  jwt.verify(req.token, 'TopSecret', (err, authdata) => {
    if (err) {
      console.log(err);
      res.json({ "status": 403, msg: { str1: 'Session Expired or Unauthorized access', str2: '' } });
    }
    else {
      console.log(req.body._id);
      post.findOne({ _id: req.body._id, appliedUsers_id: authdata.UserId })
        .then((docs) => {
          if (docs) {
            console.log("user already exist");
            res.json({ "status": 409, msg: { str1: 'User already Applied', str2: '' } })
          }
          else if (!docs) {

            post.findByIdAndUpdate(req.body._id, { "$push": { "appliedUsers_id": authdata.UserId } })
            .populate('Provider_id','email')
            .then(docs => {
              res.json({ "status": 200, msg: { str1: 'SuccessFully Applied', str2: '' } })
              try {
                console.log(docs);
                mailer.sendMail(docs.Provider_id.email, docs.jobTitle);
              } catch (e) {
                console.log(e); // uncaught
              }
            })
              .catch((err) => {

                res.end(err);
              })
          }
        });
    }
  })
}






