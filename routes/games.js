function createFilter(query) {
    var filter = {};
    if (query.title) {
        filter.title = { $regex: ".*" + query.title + ".*", $options: 'i' };
    }
    if (query.rating) {
        filter.rating = { $gt: parseInt(query.rating) };
    }
    console.log(filter);
    return filter;
}

function sortedBy(query) {
    var sort = {};
    if (query.sortedBy) {
        query.sortedBy.split(",").forEach(s => {
            const token = s.split("|");
            if (token.length > 1) {
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
     *   NewGame:
     *      type: object
     *      properties:
     *          title:
     *             type: string
     *             description: game's title
     *             example: Zelda
     *          image:
     *              type: string
     *              description: image url of the game
     *              example: http://urlimage.jpg
     *          rating:
     *              type: integer
     *              description: game's rating between 0 and 100
     *              example: 42
     *          release:
     *              type: string
     *              description: game's release date
     *              example: 2000-04-15
     *          platforms:
     *              type: array of string
     *              description: platforms supported by the game
     *              example: [PC, Nintendo Switch]
     *          description:
     *              type: string
     *              description: game's description
     *              example: "In this game, ..."
     *          publisher:
     *              type: array
     *              description: game's publisher
     *              example: Nintendo
     *          genres:
     *              type: array of string
     *              description: all game's genres
     *              example: [Adventure, Indie, Strategy]
     *          status:
     *              type: string
     *              description: game's status
     *              example: AVAILABLE
     *   Game:
     *      allOf:
     *          - properties:
     *              _id:
     *                  type: string
     *          - $ref: '#/definitions/NewGame'
     *          
     */

    // This section will help you get a list of all the documents.
    /**
     * @swagger
     * /api/v1/games:
     *   get:
     *     summary: Retrieve a list of games
     *     tags:
     *      - games
     *     description: Retrieve a list of games.
     *     responses:
     *       200:
     *         description: A list of games.
     *         content: 
     *          application/json:
     *             schema:
     *               $ref: '#/definitions/Game'
     */
    router.route("/api/v1/games").get(async function (req, res) {
        const dbConnect = dbo.getDb();

        dbConnect
            .collection("games")
            .find(createFilter(req.query))
            .sort(sortedBy(req.query))
            .skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit))
            .toArray(function (err, result) {
                if (err || !result) {
                    res.status(400).send("Error fetching game!");
                } else {
                    res.json(result);
                }
            });
    });

    /**
     * @swagger
     * /api/v1/games/count:
     *   get:
     *     summary: Retrieve the number of games
     *     tags:
     *      - games
     *     description: Retrieve the number of games.
     *     responses:
     *       200:
     *         description: The number of games.
     *         content: 
     *          text/plain:
     *             schema:
     *               status:
     *                  type: integer
     *                  description: game's number
     *                  example: 12
     */
    router.get("/api/v1/games/count", async function (req, res) {
        const dbConnect = dbo.getDb();

        dbConnect
            .collection("games")
            .count({}, function (err, result) {

                if (err) {
                    res.send(err)
                }
                else {
                    res.json(result)
                }

            })
    });

    /**
     * @swagger
     * /api/v1/games/{id}:
     *   get:
     *     summary: Retrieve a game
     *     tags:
     *      - games
     *     description: Retrieve a game by id.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Numeric ID of the game to retrieve.
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: A game.
     *         content: 
     *          application/json:
     *             schema:
     *               $ref: '#/definitions/Game'
     */
    router.route("/api/v1/games/:id").get(async function (req, res) {
        const dbConnect = dbo.getDb();

        dbConnect
            .collection("games")
            .findOne({ "_id": ObjectId(req.params.id) },
                function (err, result) {
                    if (err || !result) {
                        res.status(400).send("Error fetching game!");
                    } else {
                        res.json(result);
                    }
                });
    });
    /**
     * @swagger
     * /api/v1/games/{id}:
     *   delete:
     *     summary: delete a game
     *     tags:
     *      - games
     *     description: delete a game by id.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Numeric ID of the game to delete.
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: result of suppression.
     *         content: 
     *          application/json:
     *             schema: 
     */
    router.route("/api/v1/games/:id").delete(async function (req, res) {
        const dbConnect = dbo.getDb();
        let key = req.headers.authorization;
        //let key = req.session.user;

        if (key) {
            key = key.split(" ")[1];
            dbConnect
                .collection("users")
                .findOne({ "key": key },
                    function (err, result) {
                        if (err || !result) {
                            res.status(400).send("Error fetching User!");
                        } else {
                            if (result.role == 'Admin') {
                                dbConnect
                                    .collection("games")
                                    .deleteOne({ "_id": ObjectId(req.params.id) },
                                        function (err, result) {
                                            if (err || !result) {
                                                res.status(400).send("Error deleting game!");
                                            } else {
                                                res.json(result);
                                            }
                                        });
                            }
                            else{
                                res.status(403).send("Not authorize!");
                            }

                        }
                    });

        }
        else {
            res.status(400).send("Error deleting game!");
        }

    });
    /**
     * @swagger
     * /api/v1/games:
     *   post:
     *     summary: create a game
     *     tags:
     *      - games
     *     description: create a new game.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *               $ref: '#/definitions/NewGame'
     *     responses:
     *       200:
     *         description: result of creation.
     *         content: 
     *          application/json:
     *             schema:
     *               $ref: '#/definitions/Game'
     */
    router.route("/api/v1/games").post(async function (req, res) {
        const dbConnect = dbo.getDb();

        dbConnect
            .collection("games")
            .insertOne(req.body,
                function (err, result) {
                    if (err || !result) {
                        res.status(400).send("Error deleting game!");
                    } else {
                        res.json(result);
                    }
                });
    });
    /**
     * @swagger
     * /api/v1/games/{id}:
     *   put:
     *     summary: update a game
     *     tags:
     *      - games
     *     description: update a game.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Numeric ID of the game to delete.
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *               $ref: '#/definitions/NewGame'
     *     responses:
     *       200:
     *         description: result of update.
     *         content: 
     *          application/json:
     *             schema:
     *               $ref: '#/definitions/Game'
     */
    router.route("/api/v1/games/:id").put(async function (req, res) {
        const dbConnect = dbo.getDb();

        dbConnect
            .collection("games")
            .updateOne({ "_id": ObjectId(req.params.id) }, { $set: req.body },
                function (err, result) {
                    if (err || !result) {
                        res.status(400).send("Error deleting game!");
                    } else {
                        res.json(result);
                    }
                });
    });


}

