const uuidv4 = require('uuid').v4;
const sha256 = require("js-sha256").sha256;


function decodeBasicAuthentification(key) {
    key = key.split(" ")[1];
    const buff = Buffer.from(key, 'base64');
    const str = buff.toString('utf-8');
    const token = str.split(":");
    return {email: token[0], password: sha256(token[1]).toUpperCase()};
}
function loginFilter(body) {
    
    var filter = {};
    if(body.email){
        filter.email = body.email;
    }
    else{
        return null;
    }
    if(body.password){
        filter.password = sha256(body.password).toUpperCase();
    }
    else{
        return null;
    }
    return filter;
}

module.exports = (router, passport) => {
    // recordRoutes is an instance of the express router.
    // We use it to define our routes.
    // The router will be added as a middleware and will take control of requests starting with path /listings.
    const dbo = require('../db/conn.js')
    var ObjectId = require('mongodb').ObjectId

    /**
     * @swagger
     *
     * definitions:
     *   NewUser:
     *      type: object
     *      properties:
     *          name:
     *             type: string
     *             description: User's title
     *             example: PC
     *          image:
     *              type: string
     *              description: image url of the User
     *              example: http://urlimage.jpg
     *          date:
     *              type: string
     *              description: User's release date
     *              example: 2000-04-15
     *          description:
     *              type: string
     *              description: User's description
     *              example: "This User, ..."
     *   User:
     *      allOf:
     *          - properties:
     *              _id:
     *                  type: string
     *          - $ref: '#/definitions/NewUser'
     *          
     */

    // This section will help you get a list of all the documents.
    /**
     * @swagger
     * /api/v1/users:
     *   get:
     *     summary: Retrieve a list of Users
     *     tags:
     *      - users
     *     description: Retrieve a list of Users.
     *     responses:
     *       200:
     *         description: A list of Users.
     *         content: 
     *          application/json:
     *             schema:
     *               $ref: '#/definitions/User'
     */
    router.route("/api/v1/users").get(async function (req, res) {
        const dbConnect = dbo.getDb();
        
        dbConnect
        .collection("users")
        .find()
        .toArray(function (err, result) {
            if (err || !result) {
            res.status(400).send("Error fetching User!");
        } else {
            res.json(result);
            }
        });
    });

    /**
     * @swagger
     * /api/v1/users/count:
     *   get:
     *     summary: Retrieve the number of users
     *     tags:
     *      - users
     *     description: Retrieve the number of users.
     *     responses:
     *       200:
     *         description: The number of users.
     *         content: 
     *          text/plain:
     *             schema:
     *               status:
     *                  type: integer
     *                  description: user's number
     *                  example: 12
     */
    router.get("/api/v1/users/count", async function (req, res) {
        const dbConnect = dbo.getDb();

        dbConnect
        .collection("users")
        .count( {}, function(err, result){

            if(err){
                res.send(err)
            }
            else{
                res.json(result)
            }
    
       })
    });

    router.route("/api/v1/users/login").post(async function (req, res) {
        const dbConnect = dbo.getDb();
        const filter = loginFilter(req.body);
        //const filter = decodeBasicAuthentification(req.headers.authorization);

        if(filter){
            dbConnect
            .collection("users")
            .find(filter)
            .toArray(function(err, result){
                console.log(result);
                if(err){
                    res.send(err);
                }
                else{
                    if(result.length > 0){
                        const user = result[0];
                        user.key = uuidv4()
                        dbConnect
                        .collection("users")
                        .updateOne({"_id": user._id}, {$set: user},
                        function (err, result) {
                        if (err || !result) {
                            res.status(401).send("Bad login");
                        } else {
                            //req.session.user = user._id;
                            res.json(user);
                        }
                        });
                    }
                    else{
                        res.status(401).send("Bad login");
                    }
                }
        
           })
        }
        else{
            res.status(401).send("Bad login");
        }
    });

    /**
     * @swagger
     * /api/v1/users/{id}:
     *   get:
     *     summary: Retrieve a User
     *     tags:
     *      - users
     *     description: Retrieve a User by id.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Numeric ID of the User to retrieve.
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: A User.
     *         content: 
     *          application/json:
     *             schema:
     *               $ref: '#/definitions/User'
     */
    router.route("/api/v1/users/:id").get(async function (req, res) {
        const dbConnect = dbo.getDb();
    
        dbConnect
        .collection("users")
        .findOne({"_id": ObjectId(req.params.id)},
        function (err, result) {
            if (err || !result) {
            res.status(400).send("Error fetching User!");
        } else {
            res.json(result);
            }
        });
    });
    /**
     * @swagger
     * /api/v1/users/{id}:
     *   delete:
     *     summary: delete a User
     *     tags:
     *      - users
     *     description: delete a User by id.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Numeric ID of the User to delete.
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: result of suppression.
     *         content: 
     *          application/json:
     *             schema: 
     */
    router.route("/api/v1/users/:id").delete(async function (req, res) {
        const dbConnect = dbo.getDb();
    
        dbConnect
        .collection("users")
        .deleteOne({"_id": ObjectId(req.params.id)},
        function (err, result) {
        if (err || !result) {
            res.status(400).send("Error deleting User!");
        } else {
            res.json(result);
        }
        });
    });
    /**
     * @swagger
     * /api/v1/users:
     *   post:
     *     summary: create a User
     *     tags:
     *      - users
     *     description: create a new User.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *               $ref: '#/definitions/NewUser'
     *     responses:
     *       200:
     *         description: result of creation.
     *         content: 
     *          application/json:
     *             schema:
     *               $ref: '#/definitions/User'
     */
    router.route("/api/v1/users").post(async function (req, res) {
        const dbConnect = dbo.getDb();
    
        dbConnect
        .collection("users")
        .insertOne(req.body,
        function (err, result) {
        if (err || !result) {
            res.status(400).send("Error creating User!");
        } else {
            res.json(result);
        }
        });
    });
    /**
     * @swagger
     * /api/v1/users/{id}:
     *   put:
     *     summary: update a User
     *     tags:
     *      - users
     *     description: update a User.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Numeric ID of the User to delete.
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *               $ref: '#/definitions/NewUser'
     *     responses:
     *       200:
     *         description: result of update.
     *         content: 
     *          application/json:
     *             schema:
     *               $ref: '#/definitions/User'
     */
    router.route("/api/v1/users/:id").put(async function (req, res) {
        const dbConnect = dbo.getDb();

        dbConnect
        .collection("users")
        .updateOne({"_id": ObjectId(req.params.id)}, {$set: req.body},
        function (err, result) {
        if (err || !result) {
            res.status(400).send("Error updating User!");
        } else {
            res.json(result);
        }
        });
    });

    

    
}
