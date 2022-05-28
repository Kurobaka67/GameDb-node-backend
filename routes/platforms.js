function createFilter(query){
    var filter = {};
    if(query.name){
        filter.name = { $regex: ".*"+query.name+".*", $options: 'i' };
    }
    return filter;
}

function sortedBy(query){
    var sort = {};
    if(query.sortedBy){
        query.sortedBy.split(",").forEach(s => {
            const token = s.split("|");
            if(token.length > 1){
                sort[token[0]] = token[1];
            }
        });
    }
    
    return sort;
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
     *   NewPlatform:
     *      type: object
     *      properties:
     *          name:
     *             type: string
     *             description: platform's title
     *             example: PC
     *          image:
     *              type: string
     *              description: image url of the platform
     *              example: http://urlimage.jpg
     *          date:
     *              type: string
     *              description: platform's release date
     *              example: 2000-04-15
     *          description:
     *              type: string
     *              description: platform's description
     *              example: "This platform, ..."
     *   Platform:
     *      allOf:
     *          - properties:
     *              _id:
     *                  type: string
     *          - $ref: '#/definitions/NewPlatform'
     *          
     */

    // This section will help you get a list of all the documents.
    /**
     * @swagger
     * /api/v1/platforms:
     *   get:
     *     summary: Retrieve a list of platforms
     *     tags:
     *      - platforms
     *     description: Retrieve a list of platforms.
     *     responses:
     *       200:
     *         description: A list of platforms.
     *         content: 
     *          application/json:
     *             schema:
     *               $ref: '#/definitions/Platform'
     */
    router.route("/api/v1/platforms").get(async function (req, res) {
        const dbConnect = dbo.getDb();
        
        dbConnect
        .collection("platforms")
        .find(createFilter(req.query))
        .sort(sortedBy(req.query))
        .skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit))
        .toArray(function (err, result) {
            if (err || !result) {
            res.status(400).send("Error fetching platform!");
        } else {
            res.json(result);
            }
        });
    });

    /**
     * @swagger
     * /api/v1/platforms/count:
     *   get:
     *     summary: Retrieve the number of platforms
     *     tags:
     *      - platforms
     *     description: Retrieve the number of platforms.
     *     responses:
     *       200:
     *         description: The number of platforms.
     *         content: 
     *          text/plain:
     *             schema:
     *               status:
     *                  type: integer
     *                  description: platform's number
     *                  example: 12
     */
    router.get("/api/v1/platforms/count", async function (req, res) {
        const dbConnect = dbo.getDb();

        dbConnect
        .collection("platforms")
        .count( {}, function(err, result){

            if(err){
                res.send(err)
            }
            else{
                res.json(result)
            }
    
       })
    });

    /**
     * @swagger
     * /api/v1/platforms/{id}:
     *   get:
     *     summary: Retrieve a platform
     *     tags:
     *      - platforms
     *     description: Retrieve a platform by id.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Numeric ID of the platform to retrieve.
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: A platform.
     *         content: 
     *          application/json:
     *             schema:
     *               $ref: '#/definitions/Platform'
     */
    router.route("/api/v1/platforms/:id").get(async function (req, res) {
        const dbConnect = dbo.getDb();
    
        dbConnect
        .collection("platforms")
        .findOne({"_id": ObjectId(req.params.id)},
        function (err, result) {
            if (err || !result) {
            res.status(400).send("Error fetching platform!");
        } else {
            res.json(result);
            }
        });
    });
    /**
     * @swagger
     * /api/v1/platforms/{id}:
     *   delete:
     *     summary: delete a platform
     *     tags:
     *      - platforms
     *     description: delete a platform by id.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Numeric ID of the platform to delete.
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: result of suppression.
     *         content: 
     *          application/json:
     *             schema: 
     */
    router.route("/api/v1/platforms/:id").delete(async function (req, res) {
        const dbConnect = dbo.getDb();
    
        dbConnect
        .collection("platforms")
        .deleteOne({"_id": ObjectId(req.params.id)},
        function (err, result) {
        if (err || !result) {
            res.status(400).send("Error deleting platform!");
        } else {
            res.json(result);
        }
        });
    });
    /**
     * @swagger
     * /api/v1/platforms:
     *   post:
     *     summary: create a platform
     *     tags:
     *      - platforms
     *     description: create a new platform.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *               $ref: '#/definitions/NewPlatform'
     *     responses:
     *       200:
     *         description: result of creation.
     *         content: 
     *          application/json:
     *             schema:
     *               $ref: '#/definitions/Platform'
     */
    router.route("/api/v1/platforms").post(async function (req, res) {
        const dbConnect = dbo.getDb();
    
        dbConnect
        .collection("platforms")
        .insertOne(req.body,
        function (err, result) {
        if (err || !result) {
            res.status(400).send("Error deleting platform!");
        } else {
            res.json(result);
        }
        });
    });
    /**
     * @swagger
     * /api/v1/platforms/{id}:
     *   put:
     *     summary: update a platform
     *     tags:
     *      - platforms
     *     description: update a platform.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Numeric ID of the platform to delete.
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *               $ref: '#/definitions/NewPlatform'
     *     responses:
     *       200:
     *         description: result of update.
     *         content: 
     *          application/json:
     *             schema:
     *               $ref: '#/definitions/Platform'
     */
    router.route("/api/v1/platforms/:id").put(async function (req, res) {
        const dbConnect = dbo.getDb();

        dbConnect
        .collection("platforms")
        .updateOne({"_id": ObjectId(req.params.id)}, {$set: req.body},
        function (err, result) {
        if (err || !result) {
            res.status(400).send("Error deleting platform!");
        } else {
            res.json(result);
        }
        });
    });

    
}
