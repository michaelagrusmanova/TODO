	const mongoose = require("mongoose");
	const Joi = require('joi');
	const express = require('express');
	const app = express();
	const bcrypt = require('bcrypt');
	const _ = require('lodash');
	const cookieParser = require("cookie-parser")
	const xss = require("xss-clean")
	var sanitize = require('mongo-sanitize');   //xss attacks
	const path = require('path');

	//const checkAuth = require('./middleware/checkAuth')
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }))
	app.use(cookieParser())
	const PORT = process.env.PORT || 5000
	app.listen(PORT, () => console.log('Listening on port 5000...')); 
	app.use(xss())

// DB connection ----------------------------------------------------------
	mongoose
		//.connect("mongodb://localhost:27017/todosdb", { useNewUrlParser: true })
		.connect("mongodb+srv://Test:Test123456@cluster0-xmghi.mongodb.net/todosdb?retryWrites=true&w=majority", { useNewUrlParser: true })
		.then(() => console.log("Connected to MongoDB!"))
		.catch(error => console.error("Could not connect to MongoDB... ", error));
// -----------------------------------------------------------------------------
	

// Mongoose schemas ------------------------------------------------------
	const todoSchema = new mongoose.Schema({
		text: String,
		complete: Boolean,
		//userID: mongoose.Schema.Types.ObjectId
	});
	
	const userSchema = new mongoose.Schema({
		name: String,
		password: String, 
	});

	//nastavení schmatu - nejde vidět
	/*userSchema.set('toJSON', {
		virtuals: true,
		versionKey: false,
		transform: function(doc, ret){
			delete ret._id;
			delete ret.password;
		}
	});*/

	const Todo= mongoose.model("Todo", todoSchema);
	const User = mongoose.model("User", userSchema);

// Validation functions --------------------------------------------------------
	function validateUser(user, required = true)
	{
		const schema = {
			name:           Joi.string().min(3),
			password:       Joi.string().min(6)
		};

		return Joi.validate(user, schema, { presence: (required) ? "required" : "optional" });
	}

	function validateGetUsers(getData){
		const schema = {
			name: Joi.string(),
			password: Joi.string()
		}
		return Joi.validate(getData, schema, { presence: "optional" });
	}

	function validateTodo(todo, required = false) {
		const schema = {
			text:           Joi.string().min(3),
			complete:       Joi.bool(), 
			//userID:         Joi.string(),
		};

		return Joi.validate(todo, schema, { presence: (required) ? "required" : "optional" });
	}

	function validateGet(getData)
	{
		const schema = {
			text:       Joi.string(),
			complete:   Joi.bool(),
			select: 	Joi.string()

			//userID:     Joi.string().min(5)
		}
		return Joi.validate(getData, schema, { presence: "optional" });
	}
// -----------------------------------------------------------------------------
	
// GET requests ----------------------------------------------------------------
	//app.get('/api/todos', checkAuth, (req, res) => {
	app.get('/api/todos', (req, res) => {
		const { error } = validateGet(req.query);
		if(error){
			res.status(404).send(error.details[0].message);
			return;
		}
		let dbQuery = Todo.find();
		if(req.query.select)
			dbQuery = dbQuery.select(req.query.select);
		if(req.query.complete)
			dbQuery = dbQuery.where("complete").eq("true");
		if(req.query.complete)
			dbQuery = dbQuery.where("complete").eq("false");
		dbQuery 
		 .then(todos => {res.json(todos)})
		 .catch(err => {res.status(400).send("Požadavek selhal!");});
	});

	async function getTodoByID(id)
	{
		let todo = await Todo.findById(id);
		if (todo)
		{
			todo = todo.toJSON();
		}
		return todo;
	}

	app.get('/api/users', (req, res) => {
		const{error} = validateGetUsers(req.query);
		if(error){
			res.status(404).send(error.details[0].message);
			return;
		}
		let dbQuery = User.find();
		dbQuery
		.then(users => {res.json(users)})
		.catch(err => {res.status(400).send("Požadavek selhal!");});
	});

	async function getUserByID(id)
	{
		let user = await User.findById(id);
		if (user)
		{
			user = user.toJSON();
		}
		return user;
	}


	app.get('/api/todos/:id', (req, res) => {
		getTodoByID(req.params.id)
			.then(todo => { 
				if (todo)
					res.send(todo); 
				else 
					res.status(404).send("Todo s daným id nebyl nalezen!");
			})
			.catch(err => { res.status(400).send("Chyba požadavku GET na Todo!") });
	});

	app.get('/api/users/:id', (req, res) => {
		getUserByID(req.params.id)
		.then(user => {
			if (user)
					res.send(user); 
				else 
					res.status(404).send("Uživatel s daným id nebyl nalezen!");
			})
			.catch(err => { res.status(400).send("Chyba požadavku GET na uživatele!") });
	});

// ---------------------------------------------------------------------------

// POST requests -------------------------------------------------------------


	app.post('/api/todos', (req, res) => {
		const { error } = validateTodo(sanitize(req.body));
		if (error) {
			res.status(400).send(error.details[0].message);
		} else {
			Todo.create(sanitize(req.body))
			.then(result => { res.json(result) })
			.catch(err => { res.send("Nepodařilo se uložit todo!") });
		}
	});
	
	app.post('/api/users', (req, res) => {
		const { error } = validateUser(sanitize(req.body));
		if (error) {
			res.status(400).send(error.details[0].message);
		} else {
			User.create(sanitize(req.body))
				.then(result => { 
					res.json(result)
					//res.cookie("auth_token", token)
			        res.cookie("loggedIn", true)
				 })
				.catch(err => { res.send("Nepodařilo se uložit osobu!") });
		}
	});

	app.post('/api/users/register', async (req, res) => {
		const { error } = validateUser(sanitize(req.body));
		if(error){
			res.status(400).send(error.detail[0].message);
		}
		let user = await User.findOne({name: sanitize(req.body.name)});
		if(user){
			return res.status(400).send("Tento uživatel již existuje!");
		} else{
			user = new User(_.pick(sanitize(req.body),['name', 'password']));
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(user.password, salt);

			await user.save();
			res.send(_.pick(user,['_id', 'name']));
		}
	});

		app.post('/api/users/login', async (req, res) => {
		const { error } = validateUser(sanitize(req.body));
		if(error){
			res.status(400).send(error.detail[0].message);
		}
		let user = await User.findOne({name: sanitize(req.body.name)});
		if(!user){
			return res.status(400).send("Špatné přihlašovací jméno.");
		} 
		const validPassword = await bcrypt.compare(sanitize(req.body.password), user.password);
		if(!validPassword){
			return res.status(400).send("Špatně zadané heslo.");
		}
		//res.cookie("auth_token", token)
		res.cookie("loggedIn", true)
		res.send(true);
		res.redirect('api/todos');
	});

		app.post("/api/users/logout", async (req, res) => {
	    /*try {
	        req.user.tokens = req.user.tokens.filter((token) => {
	            return token.token !== req.token
	        })
	        await req.user.save()
	        res.clearCookie("auth_token")
	        res.clearCookie("loggedIn")
	        res.send()
	    } catch (e) {
	        res.status(500).send()
	    }*/
	     res.clearCookie("loggedIn")
	     res.send()
	})
// -----------------------------------------------------------------------------
		
// PUT requests ----------------------------------------------------------------
	app.put('/api/todos/:id', (req, res) => {
		const { error } = validateTodo(sanitize(req.body), false);
		if (error) {
			res.status(400).send(error.details[0].message);
		} else {
			Todo.findByIdAndUpdate(req.params.id, sanitize(req.body), { new: true } )
			.then(result => { res.json(result) })
			.catch(err => { res.send("Nepodařilo se uložit todo!") });
		}
	});
	
	app.put('/api/users/:id', (req, res) => {
		const { error } = validateUser(sanitize(req.body), false);
		if (error) {
			res.status(400).send(error.details[0].message);
		} else {
			User.findByIdAndUpdate(req.params.id, sanitize(req.body), { new: true })
				.then(result => { res.json(result) })
				.catch(err => { res.send("Nepodařilo se uložit osobu!") });
		}
	});
// -----------------------------------------------------------------------------

// DELETE requets ------------------------------------------------------------------
	app.delete('/api/todos/:id', (req, res) => {
		Todo.findByIdAndDelete(req.params.id)
			.then(result => { 
				if (result) 
					res.json(result);
				else
					res.status(404).send("Todo s daným id nebyl nalezen!");
			})
			.catch(err => { res.send("Chyba při mazání todo!") });
	});
	
// -----------------------------------------------------------------------------

const publicPath = path.join(__dirname, "..", "client", "build")
app.use(express.static(publicPath))

app.get("*", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });