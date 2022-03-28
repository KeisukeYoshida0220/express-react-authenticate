const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./utils/db');

require('./strategies/JwtStrategy');
require('./strategies/LocalStrategy');
require('./authenticate');

const userRouter = require('./routes/userRoutes');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : []

const corsOptions = {
  origin: (origin, callback) => {
    origin = 'http://localhost:3001'
    console.log(whitelist);
    console.log(origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credential: true,
}

app.use(cors(corsOptions));
app.use(passport.initialize());
app.use('/user', userRouter);

app.get('/', (req, res) => {
  res.send({status: 'success'})
})

const server = app.listen(process.env.PORT || 8081, () => {
  const port = server.address().port;
  console.log('App started at post:', port);
})