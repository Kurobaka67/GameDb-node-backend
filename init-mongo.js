db = new Mongo().getDB("gamesdb");

db.createCollection('users', { capped: false });
db.createCollection('games', { capped: false });
db.createCollection('platforms', { capped: false });

db.users.insertMany([
    {
        "_id": 1,
        "identifiant": "Jonathan",
        "email": "jonathan@game.com",
        "password": "189F40034BE7A199F1FA9891668EE3AB6049F82D38C68BE70F596EAB2E1857B7",
        "role": "Admin",
        "icon": ""
    },
    {
        "_id": 2,
        "identifiant": "Yves",
        "email": "yves@game.com",
        "password": "A1FCE4363854FF888CFF4B8E7875D600C2682390412A8CF79B37D0B11148B0FA",
        "role": "Contributor",
        "icon": ""
    },
    {
        "_id": 3,
        "identifiant": "Héloïse",
        "email": "heloise@game.com",
        "password": "AAA9402664F1A41F40EBBC52C9993EB66AEB366602958FDFAA283B71E64DB123",
        "role": "User",
        "icon": ""
    }
]);

db.games.insertMany([
    {
        "id": 100894211,
        "title": "Saviors of Sapphire Wings / Stranger of Sword City Revisited",
        "image": "https://images.igdb.com/igdb/image/upload/t_cover_big/co2i7f.png",
        "rating": 69,
        "release": "2021-03-16",
        "platforms": [
            "PC",
            "Nintendo Switch"
        ],
        "description": "Discover a tale of war, darkness, and the power of bonds, coming to the West for the first time! The world is plunged into ruin after Ol=Ohma, the Overlord of Darkness defeats the Knights of the Round, the last bastion of defense for mankind. 100 years later, a fallen hero returns to life and must lead a new generation of heroes to defeat Ol=Ohma’s forces and restore light and hope to the world. Explore dungeons, use traps and combat prowess to defeat powerful monsters, and bond with your allies to unlock their true potential in this RPG gem.\nIf you enjoyed your adventures in Saviors of Sapphire Wings, you can also dive into the world of Stranger of Sword City Revisited! Brimming with additional content such as expanded character creation options, in-game events, and new items and equipment, this enhanced version of the original dungeon-crawling hit is bundled with Saviors of Sapphire Wings as a bonus game!",
        "publisher": "NIS America",
        "genres": [
            "Role Playing"
        ],
        "status": "AVAILABLE"
    },
    {
        "id": 100378111,
        "title": "WRC 8 FIA World Rally Championship",
        "image": "https://images.igdb.com/igdb/image/upload/t_cover_big/co2f7h.png",
        "rating": 69,
        "release": "2015-10-08",
        "platforms": [
            "PC",
            "Nintendo Switch"
        ],
        "description": "Yes",
        "publisher": "Nacon",
        "genres": [
            "Racing",
            "Simulation",
            "Sports"
        ],
        "status": "AVAILABLE"
    },
    {
        "id": 100476411,
        "title": "Little Big Workshop",
        "image": "https://images.igdb.com/igdb/image/upload/t_cover_big/co20u4.png",
        "rating": 69,
        "release": "2019-10-17",
        "platforms": [
            "PC",
            "Nintendo Switch"
        ],
        "description": "Yes",
        "publisher": "HandyGames",
        "genres": [
            "Simulation",
            "Strategy"
        ],
        "status": "AVAILABLE"
    },
    {
        "id": 100693511,
        "title": "Old World™",
        "image": "https://images.igdb.com/igdb/image/upload/t_cover_big/co3d3e.png",
        "rating": 69,
        "release": "2020-05-05",
        "platforms": [
            "PC",
            "Nintendo Switch"
        ],
        "description": "Yes",
        "publisher": "Mohawk Games",
        "genres": [
            "Strategy"
        ],
        "status": "AVAILABLE"
    },
    {
        "id": 100365811,
        "title": "AI: The Somnium Files",
        "image": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1mjy.png",
        "rating": 69,
        "release": "2019-09-17",
        "platforms": [
            "PC",
            "Nintendo Switch"
        ],
        "description": "Yes",
        "publisher": "Spike Chunsoft Co., Ltd.",
        "genres": [
            "Adventure"
        ],
        "status": "AVAILABLE"
    },
    {
        "id": 100902411,
        "title": "Spirit of the North",
        "image": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1vh9.png",
        "rating": 69,
        "release": "2019-11-13",
        "platforms": [
            "PC",
            "Nintendo Switch"
        ],
        "description": "Yes",
        "publisher": "Merge Games",
        "genres": [
            "Adventure",
            "Casual",
            "Indie",
            "Puzzle"
        ],
        "status": "AVAILABLE"
    },
    {
        "id": 100472311,
        "title": "Yooka-Laylee and the Impossible Lair",
        "image": "https://images.igdb.com/igdb/image/upload/t_cover_big/co2z9b.png",
        "rating": 69,
        "release": "2019-10-07",
        "platforms": [
            "PC",
            "Nintendo Switch"
        ],
        "description": "Yes",
        "publisher": "Team17 Digital Limited",
        "genres": [
            "Adventure",
            "Family",
            "Indie",
            "Platformer"
        ],
        "status": "AVAILABLE"
    }
]
);