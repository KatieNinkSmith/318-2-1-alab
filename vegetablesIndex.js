const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = 3000;
const vegetables = require("./data/vegetables.js");

// middleware imported
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// middleware that we custom made
// to log the incoming requests
app.use((req, res, next) => {
  console.log(`Request received at ${new Date()} with method: ${req.method}`);
  next();
});

// create route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the carrot API!" });
});
app.get("/index", (req, res) => {
  res.send("<h1>This is the index!</h1>");
});
// Create route to vegetables
app.get("/api/vegetables", (req, res) => {
  res.send(vegetables);
});
// new
app.get("/vegetables/new", (req, res) => {
  res.render("fruits/New");
});

// delete
app.delete("/api/vegetables/:id", (req, res) => {
  if (req.params.id >= 0 && req.params.id < vegetables.length) {
    vegetables.splice(req.params.id, 1);
    res.json(vegetables);
  } else {
    res.send("<p>That is not a valid id</p>");
  }
});
// update
// put update a resorce completely
app.put("/api/vegetables/:id", (req, res) => {
  if (req.params.id >= 0 && req.params.id < vegetables.length) {
    // put takes the request body and replaces the entire database entry with it
    // find the id and replace the entire thing with the req.body
    vegetables[req.params.id] = req.body;
    res.json(vegetables[req.params.id]);
  } else {
    res.send("<p>That is not a valid id</p>");
  }
});
// patch update part of it
app.patch("/api/vegetables/:id", (req, res) => {
  if (req.params.id >= 0 && req.params.id < vegetables.length) {
    console.log(vegetables[req.params.id]);
    console.log(req.body);
    const newVegetable = { ...vegetables[req.params.id], ...req.body };
    vegetables[req.params.id] = newVegetable;
    res.json(newVegetable);
  } else {
    res.send("<p>That is not a valid id</p>");
  }
});

// create
app.post("/api/vegetables", (req, res) => {
  if (req.body.readyToEat === "on") {
    req.body.readyToEat = true;
  } else {
    req.body.readyToEat = false;
  }
  vegetables.push(req.body);
  res.json(vegetables);
});

// edit
app.get("/vegetables/edit", (req, res) => {
  if (req.params.id >= 0 && req.params.id < vegetables.length) {
    res.render("vegetables/edit", {
      vegetables: vegetables[req.params.id],
      id: req.params.id,
    });
  } else {
    res.send("<p>That is not a valid id</p>");
  }
});

// show

app.get("/vegetables/:id", (req, res) => {
  if (req.params.id >= 0 && req.params.id < vegetables.length) {
    res.json(vegetables[req.params.id]);
  } else {
    res.send("<p>That is not a valid id</p>");
  }
});

// custom middleware for errors
app.use((req, res) => {
  console.log("No other routes have sent a response.");
  res.status(404);
  res.json({ error: "Resource not found" });
});

app.listen(PORT, (req, res) => {
  console.log("listening, your a carrot");
});
