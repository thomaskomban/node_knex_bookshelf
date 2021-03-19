const express = require("express");
const methodOverride = require("method-override");
var path = require('path');
const app = express();
app.use(methodOverride('X-HTTP-Method-Override'))

app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

const knexfile = require("../knexfile");
const knex = require("knex")(knexfile);
const bookshelf = require("bookshelf")(knex);

const port = 3000;

app.use(express.urlencoded({extented: false}));

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

// Assigning Table name and the field validation
const Field = bookshelf.Model.extend({
  tableName: "fields",
  initialize: function(){    
    this.on('creating', this.validate);
  },
  validate: (model, attrs, options) => {
    let msg = '';
    if ((attrs?.firstName ?? false) == false){
      msg += ' FirstName is required |';
    }
    if ((attrs?.lastName ?? false) == false){
      msg += ' LastName is required |';
    }
    if ((attrs?.dob ?? false) == false){
      msg += ' DOB is required |';
    } 
    // else if (!(/^\d{4}-\d{1-12}-\d{0-31}$/.test(attrs.dob))) {
    //   msg += ' DOB is invalid |';
    // }
    if ((attrs?.email ?? false) != false){      
      if (!(/^[a-z0-9.]+@[a-z0-9.]+.com$/.test(attrs.email))){
        msg += ' Email is invalid |';
      }
    }
    if (msg.length){
      throw new Error(msg.substr(0, (msg.length - 1)).trim());
      msg = '';
    }
  }
});

// view form
const formRouter = require('./js/form');
app.get('/', formRouter);

// view to edit form
const formEditRouter = require('./js/formEdit');
app.get('/f/:id', formEditRouter);

// Ping Api
app.get("/ping", (req, res) => res.send("pong"));

// List all the records
app.get("/fields", (req, res) => {  
    Field.fetchAll()
    .then(function(fields) {
      res.json(fields.toJSON());
    })
    .catch(function(err) {
      res.status(500);
    });
});

// fetch a record
app.get("/field/:id", (req, res) => {
  Field.forge({id: req.params.id})
  .fetch()
  .then(function(fields) {
    if (!fields) {
      res.status(404).json({result: false, data: {}})
    } else {
      res.json(fields.toJSON());
    }
  })
  .catch(function(err) {
    res.status(500).json({result: false, data: {message: err.message}});
  });
});

// app.post("/fields", (req, res) => {
//   data = {
//     id: req.body.id,
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     dob: req.body.dob,
//     email: req.body.email
//   };
//   Field.forge(data)
//     .save(data, {method: 'insert'})
//     .then(function(model) {
//       res.json({response: true, data: {id: model.get('id')}});
//     })
//     .catch((err) => {
//       res.status(500).json({response: false, data: {message: err.message}});
//     })
// });

const maxId = bookshelf.knex('fields').max('id as m');

// add the record from Form Submit
app.post("/forms", (req, res) => {
  data = {
    id: req.body.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dob: req.body.dob,
    email: req.body.email
  };
  Field.forge(data)
    .save(data, {method: 'insert'})
    .then(function(model) {
      if(model){
        // res.json({response: true, data: {id: model.get('id')}});
        res.redirect('http://localhost:3000')
      } else {
        res.redirect('http://localhost:3000')
      }
    })
    .catch((err) => {
      res.status(500).json({result: false, data: {message: err.message}});
    })
});

// Update the record
app.put("/fields/:id", (req, res) => {
  // console.log(req.body)
  if ((req.params?.id ?? false) == false){
    res.status(404).json({response: false, data: 'record Id not found'});
  }
  Field.forge({id: req.params.id})
    .save(req.body, {method: 'update'})
    .then(function(model) {
      if (!model){
        res.status(404).json({response: false, data: {}});
      } else {
        // return res.send("success");
        res.redirect('http://localhost:3000');
      }      
    })
    .catch((err) => {
      res.status(500).json({result: false, data: {message: err.message}});
    })

  // Delete the record
  app.delete("/fields/d/:id", (req, res) => {
    res.send(req.params.id)
    Field.forge({id: req.params.id})
    .fetch({require: true})
    .then((model) => {
      model.destroy()
      .then(() => {
        res.redirect('http://localhost:3000');                
      })
      .catch((err) => {
        return res.status(500).json({result: false, data: {message: err.message}});
      })
    })
    .catch(() => {
      return res.status(500).json({result: false, data: {message: err.message}});
    })
  })
});

app.listen(port, () => console.log("Listening on port " + port));
