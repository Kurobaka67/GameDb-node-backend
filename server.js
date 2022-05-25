const express = require('express')
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express()
const port = 3000

const router = express.Router();
const dbo = require('./db/conn.js')
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors());
app.use(bodyParser.json());
dbo.connectToServer(console.log)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

require('./routes/games')(router);
require('./routes/platforms')(router);
require('./routes/users')(router);

app.use(router);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})