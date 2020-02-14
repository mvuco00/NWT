const functions = require("firebase-functions");
const admin = require("firebase-admin"); //omogucavamo pristup bazi. Firebase-admin imamo u instaliranom paketu za firebase
const express = require("express");
const app = express();
const firebase = require("firebase");

const firebaseConfig = {
  apiKey: "AIzaSyDXLbGo7FLTieyyOQ6BU8Gx0z78Gxa_-ic",
  authDomain: "myapp-c0099.firebaseapp.com",
  databaseURL: "https://myapp-c0099.firebaseio.com",
  projectId: "myapp-c0099",
  storageBucket: "myapp-c0099.appspot.com",
  messagingSenderId: "1031953644784",
  appId: "1:1031953644784:web:dd172a2516f30d7d1c9635",
  measurementId: "G-9P3GZ6ZCHL"
};

admin.initializeApp(); //zna se koji je admin jer se podaci nalaze u .firebaserc
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

//dohvati postove
app.get("/posts", (request, response) => {
  admin
    .firestore()
    .collection("posts")
    .orderBy("createdAt", "desc") //postovi ce bit predani od najnovijeg
    .get()
    .then(data => {
      let posts = [];
      data.forEach(doc => {
        posts.push({
          // vraća nam objekt sa svim ovim propertyjima
          postId: doc.id,
          body: doc.data().body,
          username: doc.data().username,
          createdAt: doc.data().createdAt
        });
      });
      return response.json(posts);
    })
    .catch(error => console.log(error));
});

//provjerava request i odluci moze li to napravit ili staje, tj jesmo li logirani
//next
const FBAuth = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1]; //uzmemo token, on je drugi
  } else {
    console.error("No token found");
    return res.status(403).json({ error: "Unauthorised action" });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken;
      console.log(decodedToken);
      return db
        .collection("users")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then(data => {
      req.user.username = data.docs[0].data().username;
      return next(); //request nastavlja dalje
    })
    .catch(err => {
      console.error("Error while verifying token ", err);
      return res.status(403).json(err);
    });
};

//objavi post
app.post("/post", FBAuth, (request, response) => {
  if (request.body.body.trim() === "") {
    return res.status(400).json({ body: "Write something" });
  }

  const newPost = {
    body: request.body.body, //request sluzi za slanje necega, u ovom slucaju to je post. Request ima svoj body, to je kao property. I mi u taj body saljemo nas tekst posta (i mi smo ga nazvali body)
    username: request.user.username,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()) // kreira datum na osnovu js objekta
  };
  admin
    .firestore()
    .collection("posts")
    .add(newPost) //sluzi za dodavanje u bazu
    .then(doc => {
      response.json({ message: `document ${doc.id} created successfully` }); // ako je uspjesno dodano saljemo poruku da je taj post dodan i salje se njegov id
    })
    .catch(err => {
      response.status(500).json({ error: "somthing went wrong with server" }); //ako nije dodan greska je sa serverom
      console.error(err);
    });
});

const isEmpty = string => {
  if (string.trim() === "") return true;
  //string se trima tj maknu se whitespaces
  else return false;
};

const isEmail = email => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) {
    return true;
  } else return false;
};

//SIGN UP
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username
  };
  let errors = {};
  if (isEmpty(newUser.email)) {
    errors.email = "Email must not be empty";
  } else if (!isEmail(newUser.email)) {
    errors.email = "Must be a valid e-mail";
  }

  if (isEmpty(newUser.password)) {
    errors.password = "Password must not be empty";
  }
  if (newUser.password !== newUser.confirmPassword) {
    errors.confirmPassword = "Passwords not match";
  }
  if (isEmpty(newUser.username)) {
    errors.username = "Must not be empty";
  }
  /*provjeravamo je li bilo gresaka, ako je onda vraćamo koje su*/
  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  let token, userId;
  db.doc(`/users/${newUser.username}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        //korisnik vec postoji
        return res.status(400).json({ username: "this username is taken" });
      } else {
        //korisnik ne postoji, prihvaća se
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken(); //vraća promise pa triba return
    })
    .then(idToken => {
      token = idToken;
      const userDocument = {
        username: newUser.username,
        email: newUser.email,
        createdAt: admin.firestore.Timestamp.fromDate(new Date()),
        userId
      };
      return db.doc(`/users/${newUser.username}`).set(userDocument);
    })
    .then(data => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.log(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({
          email: "Email is already in use"
        });
      } else {
        return res.status(200).json({ error: err.code });
      }
    });

  /*ovo sad sluzi za autentifikaciju s mailom i lozinkom. Ako je sve uspjesno vraća se kod 201*/
});

//LOGIN
app.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };
  let errors = {};

  if (isEmpty(user.email)) errors.email = "Email must not be empty";
  if (isEmpty(user.password)) errors.password = "Password must not be empty";

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        return res.status(403).json({ general: "Wrong password" });
      } else return res.status(500).json({ error: err.code });
    });
});

app.delete("/post/:postId", FBAuth, (req, res) => {
  const document = db.doc(`/posts/${req.params.postId}`);

  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Post not found" });
      }
      if (doc.data().username !== req.user.username) {
        return res.status(403).json({ error: "Unauthorised" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Post deleted sucessfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
});
exports.api = functions.https.onRequest(app);
