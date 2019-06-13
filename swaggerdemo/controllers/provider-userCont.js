const jwt = require('jsonwebtoken');
const Provider = require('../model/provider-user');
const Post = require('../model/post');


module.exports.getUser = function (req, res, next) {
  Provider.find({})
    .then(users => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      // res.json(users);
      res.render('users', { users: users });
    }, (err) => next(err))
    .catch((err) => next(err));
};

module.exports.addUser = (req, res, next) => {
  console.log(req.body);
  Provider.findOne({ companyName: req.body.companyName })
    .then((user) => {
      if (user == null) {
        Provider.create(req.body)
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
        res.json({ msg: "Company " + req.body.companyName + " Exists" });
      }
    }, err => next(err));
};

module.exports.loginUser = (req, res) => {
  let searchname = req.body.companyName;
  let passwordname = req.body.password;
  console.log(req.body);


  Provider.findOne({ companyName: searchname, password: passwordname }, (err, obj) => {
    if (obj == null) {
      res.json({ "status": 404, msg: { str1: 'Incorrect Company Name or Password.', str2: 'Not found.' } });
    }
    else {

      jwt.sign({ UserId: obj._id }, 'secret', { expiresIn: 60 * 60 }, (err, token) => {
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

module.exports.post = function (req, res) {

  console.log("hell0oo", req.token);
  jwt.verify(req.token, 'secret', (err, authdata) => {
    if (err) {
      console.log(err);
      res.json({ "status": 403, msg: { str1: 'Authentication Failed', str2: '' } });
    }
    else {
      console.log(authdata, "authdata");
      req.body.Provider_id = authdata.UserId;
      var post = new Post(req.body);

      post.save((err, data) => {
        if (err) {
          console.log(err);
          res.json({ "status": 404, msg: { str1: 'Post failed.', str2: '' } });
        }
        else {
          console.log("success");
          res.json({
            "status": 200, msg: {
              str1: 'Successfully Posted',
              str2: ''
            }
          });

        }
      })
    }
  });
};

module.exports.getPost = function (req, res, next) {
  Post.find({}).populate('Provider_id').sort({ createdAt: -1 }).
    then((formdata) => {
      res.statusCode = 200;
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(formdata);
    }, (err) => next(err));
};

module.exports.usersdata = function (req, res, next) {

  console.log(req.token, "fgdfgdfgdfgdf");
  jwt.verify(req.token, 'secret', (err, authdata) => {
    if (err) {
      console.log(err);
      res.json({ "status": 403, msg: { str1: 'Session Expired or Unauthorized access', str2: '' } });
    }
    else {
      Post.find({ Provider_id: authdata.UserId })
        .populate({ path: 'appliedUsers_id', model: 'nbUsers', populate: { path: 'resume_id', model: 'nbResume' } }, )
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
module.exports.deletePost = function (req, res, next) {
  console.log("dsdfs");
  jwt.verify(req.token, 'secret', (err, authdata) => {
    if (err) {
      res.json({ "status": 403, msg: { str1: 'Session Expired or Unauthorized access', str2: '' } });
    }
    else {
      Post.findByIdAndDelete(req.params._id).then(docs => {
        return Post.find({ "Provider_id": authdata.UserId });

      })
        .then((Data) => {
          res.json({ "status": 200, data: Data, msg: { str1: 'Post Successfully Deleted', str2: '' } });
        })
        .catch((err) => {
          res.json({ "status": 404 });
          rs.end(err);
        })
    }

  });
}

module.exports.ComPost = function (req, res, next) {

  jwt.verify(req.token, 'secret', (err, authdata) => {
    if (err) {
      res.json({ "status": 403, msg: { str1: 'Session Expired or Unauthorized access', str2: '' } });
    }
    else {
      Post.find({ "Provider_id": authdata.UserId }).sort({ createdAt: -1 })
        .then((docs) => {
          res.json({ "status": 200, data: docs });
        })
        .catch((err) => {
          res.json({ "status": 404 });
          rs.end(err);
        })
    }

  });

}

module.exports.search = function (req, res, next) {

  Post.find({ skills: { $regex: req.body.Search, $options: 'i m' } })
    .then((docs) => {
      res.json({ "status": 200, data: docs })
    })
    .catch(err => {
      res.send(err);
    });

}









