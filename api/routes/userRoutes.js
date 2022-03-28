const express = require('express');
const router = express.Router();
const User = require('../models/user');

const { getToken, COOKIE_OPTIONS, getRefreshRToken } = require('../authenticate');

router.post('/signup', (req, res, next) => {
  if(!req.body.firstName){
    res.statusCode = 500;
    res.send({
      name: 'FIrst Name Error',
      message: 'The first name is required',
    })
  } else {
    User.register(
      new User({username: req.body.username}),
      req.body.password,
      (err, user) => {
        if(err){
          res.statusCode = 500;
          res.send(err);
        } else {
          user.firstName = req.body.firstName,
          user.lastName = req.body.lastName || ''
          const token = getToken({_id: user._id})
          const refreshToken = getRefreshToken({_id: user._id});
          user.refreshToken.push({refreshToken});
          user.save((err, user) => {
            if(err){
              res.statusCode = 500;
              res.send(err);
            } else {
              res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
              res.send({sucess: true, token})
            }
          })
        }
      }
    )
  }
})

module.exports = router;