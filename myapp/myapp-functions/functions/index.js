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
          createdAt: doc.data().createdAt,
          likeCount: doc.data().likeCount,
          userImage: doc.data().userImage
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
      req.user.imageUrl = data.docs[0].data().imageUrl;
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
    return response.status(400).json({ body: "Write something" });
  }

  const newPost = {
    body: request.body.body, //request sluzi za slanje necega, u ovom slucaju to je post. Request ima svoj body, to je kao property. I mi u taj body saljemo nas tekst posta (i mi smo ga nazvali body)
    username: request.user.username,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()), // kreira datum na osnovu js objekta
    likeCount: 0,
    userImage: request.user.imageUrl
  };
  admin
    .firestore()
    .collection("posts")
    .add(newPost) //sluzi za dodavanje u bazu
    .then(doc => {
      const resPost = newPost;
      resPost.postId = doc.id;
      response.json(resPost); // ako je uspjesno dodano saljemo poruku da je taj post dodan i salje se njegov id
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
  const defaultimage = "no-img.png";
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
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${defaultimage}?alt=media`,
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

//BRISANJE
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

//Get user details
app.get("/user/:username", (req, res) => {
  let userData = {};
  db.doc(`/users/${req.params.username}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.user = doc.data();
        return db
          .collection("posts")
          .where("username", "==", req.params.username)
          .get();
      } else {
        return res.status(404).json({ error: "user not found" });
      }
    })
    .then(data => {
      userData.posts = [];
      data.forEach(doc => {
        userData.posts.push({
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          username: doc.data().username,
          likeCount: doc.data().likeCount,
          userImage: doc.data().userImage,
          postId: doc.id
        });
      });
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
});

const reduceUserDetails = data => {
  let userDetails = {};
  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    //
    if (data.website.trim().substring(0, 4) !== "http") {
      userDetails.website = `http://${data.website.trim()}`;
    } else {
      userDetails.website = data.website;
    }
  }
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};

//Add user details
app.post("/user", FBAuth, (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.username}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: "Details added succesfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
});

app.get("/user", FBAuth, (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.username}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection("likes")
          .where("username", "==", req.user.username)
          .get();
      }
    })
    .then(data => {
      userData.likes = [];
      data.forEach(doc => {
        userData.likes.push(doc.data());
      });
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
});

//GET POST:POST-ID
app.get("/post/:postId", (req, res) => {
  let postData = {};
  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Post not found" });
      }
      postData = doc.data();
      postData.postId = doc.id;
      return db
        .collection("comments")
        .where("postId", "==", req.params.postId)
        .get();
    })
    .then(data => {
      postData.comments = [];
      data.forEach(doc => {
        postData.comments.push(doc.data());
      });
      return res.json(postData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
});

//LAJKANJE POSTA
app.get("/post/:postId/like", FBAuth, (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("username", "==", req.user.username)
    .where("postId", "==", req.params.postId)
    .limit(1);

  const postDocument = db.doc(`/posts/${req.params.postId}`);
  let postData = {};

  postDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        postData = doc.data();
        postData.postId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Post not found" });
      }
    })
    .then(data => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            postId: req.params.postId,
            username: req.user.username
          })
          .then(() => {
            postData.likeCount++;
            return postDocument.update({ likeCount: postData.likeCount });
          })
          .then(() => {
            return res.json(postData);
          });
      } else {
        return res.status(400).json({ error: "Post already liked" });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
});

app.get("/post/:postId/unlike", FBAuth, (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("username", "==", req.user.username)
    .where("postId", "==", req.params.postId)
    .limit(1);

  const postDocument = db.doc(`/posts/${req.params.postId}`);
  let postData = {};

  postDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        postData = doc.data();
        postData.postId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Post not found" });
      }
    })
    .then(data => {
      if (data.empty) {
        return res.status(400).json({ error: "Post not liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            postData.likeCount--;
            return postDocument.update({ likeCount: postData.likeCount });
          })
          .then(() => {
            res.json(postData);
          });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
});

//SLIKA
app.post("/user/image", FBAuth, (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageToBeUploaded = {};
  let imageFileName;

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }

    const imageExtension = filename.split(".")[filename.split(".").length - 1];

    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.username}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: "image uploaded successfully" });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
});

exports.onUserImageChange = functions.firestore
  .document("/users/{userId}")
  .onUpdate(change => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("image has changed");
      const batch = db.batch();
      return db
        .collection("posts")
        .where("username", "==", change.before.data().username)
        .get()
        .then(data => {
          data.forEach(doc => {
            const post = db.doc(`/posts/${doc.id}`);
            batch.update(post, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

exports.api = functions.https.onRequest(app);
