const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');  
const cookieParser = require("cookie-parser");
const path = require('path');
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/*
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));*/

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

app.use(cookieParser());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//---------------------------------CONNECTION A LA DB MYSQL----------------------------------------------------//

var mysql = require('mysql');
const db = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'Si7iojquz!',
  database : 'yowl',
  //socketPath: '/var/run/mysqld/mysqld.sock',
  multipleStatements: true,
});

db.connect(function(err) {
  if (err) throw err;
  console.log("Connecté à la base de données MySQL!");
});

//------------------------------------ROUTES------------------------------------------------------------//
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-reqed-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DEvarE, PATCH, OPTIONS');
    next();
  });

 //ROUTE VERS INDEX/HOMEPAGE
app.get('/', function(req, res) {
  mySession=req.session;
  res.render(path.join(__dirname, '/views/index.html'), {session: mySession});
});


//ROUTE VERS LE LOGIN
app.get('/login', function(req, res) {
  // Render login template
  res.sendFile(__dirname + '/views/login.html');
});

//ROUTE POUR VERIFIER LE LOGIN
app.post('/login', (req, res, next) => {
    // Capture the input fields
    var email = req.body.email;
    var password = req.body.password;
    const saltRounds = 10;
    var sql= '';

    function fetchData(hash) {
      return new Promise(function(resolve, reject) {
          db.query(sql, function (err, rows, fields) {
              if (err) {
                  return reject(err);
              }
              resolve(rows);
              result = rows;
              console.log("result : " + result)
          });
        });
    }

    // Ensure the input fields exists and are not empty
    if (email && password) {
      bcrypt.hash(password, saltRounds, function (err,  hash) {
          sql = 'SELECT * FROM users WHERE email ="'+ email + '"  AND password ="' + password + '";'
          // GO CHECK IF USER EXISTS AND FETCH ID AND NAME
        fetchData(hash).then(function(rows) {
          mySession=req.session;
          mySession.user=email;
            console.log(sql)
            if (result.length <= 0) {
              console.log('Un compte existe déjà avec ce pseudo ou cet email')
              res.redirect('/login');
            } else {
              res.redirect('/');
            }
          //res.render(path.join(__dirname, '/views/user.html'), {user: rows[0], posts: rows[1]});
   
        });
      });
    };

});

//ROUTE VERS LE SIGN UP
app.post('/signup', function(req, res) {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  const saltRounds = 10;

  // Execute SQL query that'll select the account from the database based on the specified username and password
      db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username,email], function(error, results, fields) {
        // If there is an issue with the query, output the error
        if (error) throw error;
          // If the account exists
          if (results.length > 0) {
            console.log('Un compte existe déjà avec ce pseudo ou cet email')
            res.redirect('/signup');
          } else {
            bcrypt.hash(password, saltRounds, function (err,  hash) {
              db.query('INSERT INTO users (username, email, password, passward) values (?,?,?,?);', [username,email,password, hash], function(error, results, fields) {
              // If there is an issue with the query, output the error
              if (error) {
                throw error;
              };
              console.log('Votre compte a bien été crée')
              res.redirect('/');
              });
            })
          }
      });
});


//ROUTE VERS LE SIGN UP
  app.get('/signup', function(req, res) {
    // Render login template
    res.sendFile(__dirname + '/views/signup.html'); 
 });

 //ROUTE UNE FOIS SIGNED UP WITH GOOGLE
 app.use('/signupGoogle', function(req, res) {
   console.log(req.body)
});

//ROUTE VERS ADMIN
app.get('/admin', function(req, res, callback) {
  mySession = req.session
    var sql = "select id, username, email from users where admin = 1;select * from users where admin = 0;select id, title, content from posts";
    function fetchData() {
    return new Promise(function(resolve, reject) {
        db.query(sql, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
      });
    }

  fetchData().then(function(rows) {
    if(mySession.user) {
      res.render(path.join(__dirname, '/views/admin.html'), {session: mySession, admin: rows[0], users: rows[1], posts: rows[2],});
    } else {
      res.redirect('/login');
    }
  });
});

//ROUTE POUR ADD ADMIN DEPUIS ADMIN
app.post('/admin', function(req, res) { // verifier est ce que l'info est ajoutée
  var username = req.body.username;
  var email = req.body.email;
  var title = req.body.title;
  var content = req.body.content;
  var city = req.body.city;
  var categorie = req.body.categorie;
  var admin = req.body.admin; 
  var mySession = req.session;
  var emailUser = mySession.user
  var id = '';
  if (title == false || title == undefined ) {
    var sql = 'insert into users (username, email, admin) VALUES ("'+ username +'", "'+ email +'", "'+ admin +'")';
       // REQUETE VIA LA DB MYSQL
    db.query(sql, function(err, result) {
      if (err) throw err;
      if(admin === 0 ) {
        console.log('User inserted');
      } else if (admin === 1 ) {
        console.log('Admin inserted');
      }
    });
  }
  if (username == false || username == undefined)  {
      var sqlCheck = 'select email from users where email = "'+ emailUser +'";';
       // REQUETE VIA LA DB MYSQL
       db.query(sqlCheck, function(err, result) {
        if (err) throw err;
        id = result[0].id;
        var sql = 'insert into posts (title, content, city, categorie, email) VALUES ("'+ title +'", "'+ content +'", "'+ city +'", "'+ categorie +'", "'+ email +'")';
        db.query(sql, function(err, result) {
          if (err) throw err;
          console.log(sql);
      });
    
    });
  }
    res.redirect('/admin');

});

//ROUTE POUR UDPATE DEPUIS ADMIN
app.get('/admin/update/users/:id/:name/:email', function(req, res, callback) {
  const table = req.params.table;
  const id = req.params.id;
  const name = req.params.name;
  const email = req.params.email;
  var sql = "UPDATE users SET username ='"+ name + "', email ='" + email + "' WHERE id = " + id + ";"
   // REQUETE VIA LA DB MYSQL
   db.query(sql, function(err, result, fields) {
    if (err) throw err;
    res.redirect('/admin')
    }); 
});

//ROUTE POUR UDPATE DEPUIS ADMIN
app.get('/admin/update/posts/:id/:name/:email', function(req, res, callback) {
  const table = req.params.table;
  const id = req.params.id;
  const name = req.params.name;
  const email = req.params.email;
  var sql = "UPDATE posts SET title ='"+ name + "', content ='" + email + "' WHERE id = " + id + ";"
   // REQUETE VIA LA DB MYSQL
   db.query(sql, function(err, result, fields) {
    if (err) throw err;
    res.redirect('/admin')
    }); 
});

//ROUTE POUR UPGRADE UN USER OU DOWNGRADE UN ADMIN
app.get('/admin/upgrade/:table/:id', function(req, res, callback) {
  const table = req.params.table;
  const id = req.params.id;
  //FETCH L'INFO DE L'USER/ADMIN
  var sql1 = "select admin from "+ table + " WHERE id = " + id + ";"
  //PUIS ADJUST EN FONCTION
  var sql2 = "UPDATE " + table + " SET admin = 0 WHERE id = " + id + ";"
  var sql3 = "UPDATE " + table + " SET admin = 1 WHERE id = " + id + ";"
   // REQUETE VIA LA DB MYSQL
   db.query(sql1, function(err, result, fields) {
    if (err) throw err;
    var resultat = result[0];
    //C'EST UN USER DONC UPGRADE VERS ADMIN
    if (resultat.admin == 0) {
      db.query(sql3, function(err, result, fields) {
        if (err) throw err;
        res.redirect('/admin');
      });
    //C'EST UN ADMIN DONC DOWNGRADE VERS USER
    } else if (resultat.admin == 1) {
      db.query(sql2, function(err, result, fields) {
        if (err) throw err;
        res.redirect('/admin');
      });
    }
    }); 
});

//ROUTE POUR DELETE DEPUIS ADMIN
app.get('/admin/delete/:table/:id', function(req, res, callback) {
  const table = req.params.table;
  const id = req.params.id;
  var sql = "delete from " + table + " where id =" + id + ";"
   // REQUETE VIA LA DB MYSQL
   db.query(sql, function(err, result, fields) {
    if (err) throw err;
    res.redirect('/admin')
    }); 
});

//ROUTE VERS LE PROFIL USER
app.get('/checkUser/:email', function(req, res){
  var mySession = req.session;
  var email = req.params.email
  // REQUETE VIA LA DB MYSQL
    function fetchData() {
      return new Promise(function(resolve, reject) {
        db.query('select admin from users where email = "'+ email +'";', function (err, rows, fields) {
              if (err) {
                  return reject(err);
              }
              var admin = rows[0].admin;
              console.log(rows)
              console.log(admin)
              resolve(admin);
          });
        });
      }

    fetchData().then(function(admin) {
      if(admin === 0) {
        res.redirect("/users/"+email)
      } else if (admin === 1) {
        res.redirect('/admin')
      }
    });
  
  });

//ROUTE POUR ADD ADMIN DEPUIS ADMIN
app.post('/users', function(req, res) { // verifier est ce que l'info est ajoutée
  var title = req.body.title;
  var content = req.body.content;
  var city = req.body.city;
  var categorie = req.body.categorie;
  var mySession = req.session;
  var emailUser = mySession.user
  var id = '';
      var sqlCheck = 'select email from users where email = "'+ emailUser +'";';
       // REQUETE VIA LA DB MYSQL
       db.query(sqlCheck, function(err, result) {
        if (err) throw err;
        id = result[0].id;
        var sql = 'insert into posts (title, content, city, categorie, email) VALUES ("'+ title +'", "'+ content +'", "'+ city +'", "'+ categorie +'", "'+ emailUser +'")';
        db.query(sql, function(err, result) {
          if (err) throw err;
          console.log(sql);
      });
    
    });
    res.redirect('/users/'+ emailUser);

});


//ROUTE VERS LE PROFIL USER
app.get('/users/:email', function(req, res){
  const email = req.params.email;
  var mySession = req.session;
  // REQUETE VIA LA DB MYSQL
 /* db.query('select * from users where email= "'+ name + '";', function(err, result, fields) {
    if (err) throw err;
    res.sendFile(__dirname + '/views/user.html'); 
    }); */

    function fetchData() {
      return new Promise(function(resolve, reject) {
        db.query('select * from users where email = "'+ email + '"; select id, title, content from posts where email="'+ email + '";', function (err, rows, fields) {
              if (err) {
                  return reject(err);
              }
              resolve(rows);
          });
        });
      }

    fetchData().then(function(rows) {
      console.log(rows)
      if(mySession.user) {
        res.render(path.join(__dirname, '/views/user.html'), {session : mySession, user: rows[0], posts: rows[1]});
      } else {
        res.redirect('/login');
      }
    });
  });

//ROUTE POUR ADD POST DEPUIS USER
app.post('/user', function(req, res) { // verifier est ce que l'info est ajoutée
  var title = req.body.title;
  var content = req.body.content;
  
  var sql = 'insert into posts (title, content) VALUES ("'+ title +'", "'+ content +'")';
   // REQUETE VIA LA DB MYSQL
   db.query(sql, function(err, result) {
    if (err) throw err;
    res.redirect('/user');
  });
});

  //ROUTE POUR UDPATE POST DEPUIS USER
app.get('/user/update/:table/:id/:title/:content', function(req, res, callback) {
  const table = req.params.table;
  const id = req.params.id;
  const title = req.params.title;
  const content = req.params.content ;
  var sql = "UPDATE " + table + " SET title='"+ title + "', content ='" + content + "' WHERE id = " + id + ";"
   // REQUETE VIA LA DB MYSQL
   db.query(sql, function(err, result, fields) {
    if (err) throw err;
    res.redirect('/user')
    }); 
});

  //ROUTE POUR DELETE POST DEPUIS USER
app.get('/user/delete/:table/:id', function(req, res, callback) {
  const table = req.params.table;
  const id = req.params.id;
  var sql = "delete from " + table + " where id =" + id + ";"
   // REQUETE VIA LA DB MYSQL
   db.query(sql, function(err, result, fields) {
    if (err) throw err;
    res.redirect('/user')
    }); 
});

//ROUTE VERS TOUTES LES VILLES
app.get('/cities/all', function(req, res){
  var mySession = req.session;
  const name = req.params.name;
  // REQUETE VIA LA DB MYSQL
  db.query('select * from cities;', function(err, result, fields) {
    if (err) throw err;
    //res.send(result);
    res.render(path.join(__dirname, '/views/destination.html'), {session : mySession});
    }); 
});

  //ROUTE VERS LA VILLE SELECTIONNEE
app.get('/cities/:name', function(req, res){
    var mySession = req.session;
    const name = req.params.name;
    // REQUETE VIA LA DB MYSQL
    function fetchData() {
      return new Promise(function(resolve, reject) {
        db.query('select * from cities where name = "'+ name + '";', function (err, rows, fields) {
              if (err) {
                  return reject(err);
              }
              resolve(rows);
          });
        });
      }
    fetchData().then(function(rows) {
      res.render(path.join(__dirname, '/views/destination.html'), {city: rows, session : mySession});
    });
  });

//ROUTE VERS TOUS LES POST HOTEL
app.get('/hotel', function(req, res){
  const mySession = req.session;
  // REQUETE VIA LA DB MYSQL
  function fetchData() {
    return new Promise(function(resolve, reject) {
      db.query('select * from posts where categorie = "hotel";', function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            console.log(rows)
            resolve(rows);
        });
      });
    }
  fetchData().then(function(rows) {
    res.render(path.join(__dirname, '/views/hotel.html'), {posts: rows, session : mySession});
  });
});

//ROUTE VERS TOUS LES POST HOTEL
app.get('/hotel/:city', function(req, res){
  const mySession = req.session;
  let city = req.params.city;
  // REQUETE VIA LA DB MYSQL
  function fetchData() {
    return new Promise(function(resolve, reject) {
      db.query('select * from posts where city="'+city+'" AND categorie = "hotel";', function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            console.log(rows)
            resolve(rows);
        });
      });
    }
  fetchData().then(function(rows) {
    res.render(path.join(__dirname, '/views/hotel.html'), {posts: rows, session : mySession});
  });
});

//ROUTE VERS TOUS LES POST HOTEL
app.get('/restaurant', function(req, res){
  const id = req.params.id;
  const mySession = req.session;
  // REQUETE VIA LA DB MYSQL
  function fetchData() {
    return new Promise(function(resolve, reject) {
      db.query('select * from posts where categorie = "restaurant";', function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
      });
    }
  fetchData().then(function(rows) {
    res.render(path.join(__dirname, '/views/restaurant.html'), {posts: rows, session : mySession});
  });
});

//ROUTE VERS TOUS LES POST HOTEL
app.get('/restaurant/:city', function(req, res){
  const mySession = req.session;
  let city = req.params.city;
  // REQUETE VIA LA DB MYSQL
  function fetchData() {
    return new Promise(function(resolve, reject) {
      db.query('select * from posts where city="' + city + '" AND categorie = "restaurant";', function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
      });
    }
  fetchData().then(function(rows) {
    res.render(path.join(__dirname, '/views/restaurant.html'), {posts: rows, session : mySession});
  });
});

//ROUTE VERS TOUS LES POST HOTEL
app.get('/activite', function(req, res){
  const id = req.params.id;
  const mySession = req.session;
  // REQUETE VIA LA DB MYSQL
  function fetchData() {
    return new Promise(function(resolve, reject) {
      db.query('select * from posts where categorie = "activite";', function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
      });
    }
  fetchData().then(function(rows) {
    res.render(path.join(__dirname, '/views/activite.html'), {posts: rows, session : mySession});
  });
});


//ROUTE VERS TOUS LES POST HOTEL
app.get('/activite/:city', function(req, res){
  const id = req.params.id;
  const mySession = req.session;
  let city = req.params.city;
  // REQUETE VIA LA DB MYSQL
  function fetchData() {
    return new Promise(function(resolve, reject) {
      db.query('select * from posts where city ="'+city +'" AND categorie = "activite";', function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
      });
    }
  fetchData().then(function(rows) {
    res.render(path.join(__dirname, '/views/activite.html'), {posts: rows, session : mySession});
  });
});

 //ROUTE VERS TOUTES LES POSTS
app.get('/posts/all', function(req, res){
  const mySession = req.session;
    const name = req.params.name;
    // REQUETE VIA LA DB MYSQL
    db.query('select * from posts;', function(err, result, fields) {
      if (err) throw err;
      res.render(path.join(__dirname, '/views/post.html'), {session : mySession, posts : result });
      }); 
  });

  //ROUTE VERS LE POST SELECTIONNE
app.get('/posts/:id', function(req, res){
    const id = req.params.id;
    const mySession = req.session;
    // REQUETE VIA LA DB MYSQL
    db.query('select * from posts where id = "'+ id + '";select * from comments where posts_id = "'+ id + '";', function(err, result, fields) {
        if (err) throw err;
        res.render(path.join(__dirname, '/views/post.html'), {session : mySession, posts : result[0], comment : result[1]});
    });
});



//ROUTE POUR ADD COMMENT DEPUIS POST
app.post('/posts/:id', function(req, res) { 
  var mySession = req.session
  if(mySession.user) {
    var comment = req.body.comment; // A verifier BDD
    var id2 = req.body.id2; // A verifier BDD
    var sql = 'insert into comments (content, username, posts_id) VALUES ("'+ comment +'", "'+ mySession.user +'", "'+ id2 +'")';
     // REQUETE VIA LA DB MYSQL
     db.query(sql, function(err, result) {
      if (err) throw err;
      res.redirect('/posts/'+id2);
    });
  } else {
    res.redirect('/login');
  }

});


app.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});



//----------------------------EXPORT DU MODULE A LAISSER A LA FIN--------------------------------------------//
module.exports = app;