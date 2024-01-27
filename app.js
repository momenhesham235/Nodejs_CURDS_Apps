const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
const User = require("./models/userSchema");
const moment = require("moment");
let methodOverride = require("method-override");
app.use(methodOverride("_method"));

// automatic refers to public
const path = require("path");
const liveReload = require("livereload");
const liveReloadServer = liveReload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));

const connectLiveReload = require("connect-livereload");
app.use(connectLiveReload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://hmomen235:3N1Y88e0eaDfrNu0@crud.3mrc4rp.mongodb.net/all-data?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost: ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Get Request
app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.render("index", { users, moment });
  } catch (err) {
    console.log(err);
  }
});

app.get("/user/add.html", (req, res) => {
  res.render("user/add.ejs");
});

app.get("/details/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render("user/view.ejs", { user, moment });
});

app.get("/update/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render("user/edit.ejs", { user });
});

app.get("/search", (req, res) => {
  console.log(req.query.search);
  User.find({
    $or: [{ firstName: req.query.search }, { lastName: req.query.search }],
  })
    .then((users) => {
      res.render("user/search", { users, moment });
    })
    .catch((err) => {
      console.log(err);
    });
});

// post request
app.post("/user/add.html", (req, res) => {
  console.log(req.body);
  User.create(req.body)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

// put request
app.put("/edit/:id", (req, res) => {
  console.log(req.body);
  console.log(req.params.id);
  User.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

// delete request
app.delete("/delete/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});
