const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./utils/db');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

const whiteList = process.env.WHITELISTED_DOMAINS ? process.env.WHITELISTED_DOMAINS.split(',') : [];

const corsOptions = {
  origin: (origin, callback) => {
    if(!origin || whiteList.indexOf(origin) !== -1){
      callback(null, true)
    } else {
      callback(new Error('Not allowed by COR'));
    }
  },
  credential: true,
}

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send({status: 'success'})
})

const server = app.listen(process.env.PORT || 3000, () => {
  const port = server.address().port;
  console.log('App started at post:', port);
})