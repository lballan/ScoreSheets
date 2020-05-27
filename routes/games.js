var express		= require("express"),
	router		= express(),
	Game		= require("../models/game"),
	middleware	= require("../middleware/users");

// INDEX - show all games
router.get("/", function(req, res){
	Game.find({}, function(err, allGames){
		if(err){
			console.log(`error occurred while loading index: ${err}`);
			// SHOULD REDIRECT TO ERROR PAGE IN THE FUTURE
			res.respond("An error occured, sorry :(");
		} else {
			res.render("games/index", {games: allGames});
		}
	});
});

// NEW - form to add a new game
// router.get("/new", middleware.isAdmin, function(req, res){
router.get("/new", function(req, res){
	res.render("games/new");
});

// CREATE - actually add a new game
router.post("/", middleware.isAdmin, function(req, res){
	res.send("You've requested to add a game, nice!");
});

// SHOW - display each individual game
router.get("/:game", function(req, res){
	// res.send("So you wanna calculate the score for " + req.params.game + ", eh?!");
	Game.findById(req.params.game).exec(function(err, game){
		if(err){
			// NEED BETTER ERROR HANDLING
			console.log(err);
			res.redirect("/");
		} else {
			res.render("games/show", {game: game});
		}
	});
});

// EDIT - form for editting a game
router.get("/:game/edit", middleware.isAdmin, function(req, res){
	res.send("This will be the edit page of " + req.params.game);
});

// UPDATE - actually edits the game
router.put("/:game", middleware.isAdmin, function(req, res){
	res.send("You tried editting " + req.params.game + ", good for you!");
});

// DESTROY - deletes a game
router.delete("/:game/delete", middleware.isAdmin, function(req, res){
	res.send("You're gonna delete " + req.params.game + "!!!");
});

module.exports = router;