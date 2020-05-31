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
router.get("/new", middleware.isAdmin, function(req, res){
// router.get("/new", function(req, res){
	var calcMethods = ["reg"],
		formTypes	= ["text", "checkbox", "number"];
	res.render("games/new", {calcMethods: calcMethods, formTypes: formTypes});
});

// CREATE - actually add a new game
router.post("/", middleware.isAdmin, function(req, res){
// router.post("/", function(req, res){
	var name		= req.body.name,
		image		= req.body.image,
		minPlayers	= req.body.minPlayers,
		maxPlayers	= req.body.maxPlayers,
		fields		= [],
		// field		= {},
		count		= req.body.count,
		skip		= req.body.skip;
		
	// name: String, fieldName
	// value: Number, fieldValue
	// title: String, fieldTitle
	// type: String, fieldFormType
	// icon: String, fieldIcon
	// classesDesc: String, fieldDescClasses
	// classesPlayer: String, fieldPlayerClasses
	// calcMethod: String, fieldCalcMethod
	// scoreTotal: Boolea, fieldScoreTotal
	
	for(i = 1; i <= count; i++){
		if(skip.includes(String(i))){
			continue;
		}
		
		let field = {};
		
		field.name = eval("req.body.fieldName" + String(i)) ? eval("req.body.fieldName" + String(i)) : "";
		field.value = eval("req.body.fieldValue" + String(i)) ? Number(eval("req.body.fieldValue" + String(i))) : "";
		field.title = eval("req.body.fieldTitle" + String(i)) ? eval("req.body.fieldTitle" + String(i)) : "";
		field.type = eval("req.body.fieldFormType" + String(i)) ? eval("req.body.fieldFormType" + String(i)) : "";
		field.icon = eval("req.body.fieldIcon" + String(i)) ? eval("req.body.fieldIcon" + String(i)) : "";
		field.classesDesc = eval("req.body.fieldDescClasses" + String(i)) ? eval("req.body.fieldDescClasses" + String(i)) : "";
		field.classesPlayer = eval("req.body.fieldPlayerClasses" + String(i)) ? eval("req.body.fieldPlayerClasses" + String(i)) : "";
		field.calcMethod = eval("req.body.fieldCalcMethod" + String(i)) ? eval("req.body.fieldCalcMethod" + String(i)) : "";
		field.scoreTotal = eval("req.body.fieldScoreTotal" + String(i)) === "on";
		
		fields.push(field);
	}
	
	var newGame = {
		name: name,
		image: image,
		minPlayers: minPlayers,
		maxPlayers: maxPlayers,
		fields: fields
	}

	Game.create(newGame, function(err, newlyCreated){
		if(err){
			console.log(err);
			req.flash("error", `Could not add ${newGame.name} due to an error: ${err}`);
			res.redirect("back");
		} else {
			console.log(newlyCreated);
			res.redirect(`/games/${newlyCreated._id}`);
		}
	});

	// res.send("You've requested to add a game, nice!");
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
	Game.findById(req.params.game, function(err, game){
		if(err){
			// NEED BETTER ERROR HANDLING
			console.log(err);
			req.flash("error", "Couldn't find the game");
			return res.redirect("/games");
		}
		res.render("games/edit", {game: game});
	});
});

// UPDATE - actually edits the game
router.put("/:game", middleware.isAdmin, function(req, res){
	res.send("You tried editting a game, good for you!");
	// res.send("You tried editting " + req.params.game + ", good for you!");
});

// DESTROY - deletes a game
router.delete("/:game/delete", middleware.isAdmin, function(req, res){
	Game.findByIdAndRemove(req.params.game, function(err){
		if(err){
			console.log(err);
			req.flash("error", "Couldn't find or remove the game");
			res.redirect("/games");
		} else {
			// ADD TO THE FLASH MESSAGE WHICH GAME WAS REMOVED
			req.flash("success", "Successfully removed the game");
			res.redirect("/games");
		}
	})
	// res.send("You're gonna delete " + req.params.game + "!!!");
});

module.exports = router;