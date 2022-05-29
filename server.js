const express = require('express')
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;
const dbo = require('./db/conn.js')
//const cookieParser = require('cookie-parser');
//const session = require('express-session');

passport.use(new Strategy(
  function(token, cb) {
    const dbConnect = dbo.getDb();
    dbConnect.collection('users').findOne({key: token}, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      return cb(null, user);
    });
  }));

const app = express()
const port = 3000

const router = express.Router();
const bodyParser = require('body-parser');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Game Database API',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'Jonathan GRILL',
      url: 'https://github.com/Kurobaka67',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const corsOptions = {
  origin: 'http://localhost:8080',
  credentials : true
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors(corsOptions));
//app.use(cookieParser());
//app.use(session({secret: "Shh, its a secret!"}));
//app.use(bodyParser.json({ limit: '1mb'}));
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
dbo.connectToServer(console.log)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

require('./routes/games')(router, passport);
require('./routes/platforms')(router, passport);
require('./routes/users')(router, passport);

app.use(router);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})