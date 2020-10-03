require("dotenv").config();

const express = require("express");
const connection = require("./db");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const { urlencoded } = require("body-parser");

const app = express();

//Global middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//API routes

//get all gods
app.get("/api/gods", (req, res) => {
  connection.query(
    "SELECT id, name, ases, childs, creation_date FROM gods",
    (err, results) => {
      if (err) {
        res.status(500).json({
          error: err.message,
          sql: err.sql,
        });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//get all gods but only name and creation date
app.get("/api/gods/name", (req, res) => {
  connection.query("SELECT name, creation_date FROM gods", (err, results) => {
    if (err) {
      res.status(500).json({
        error: err.message,
        sql: err.sql,
      });
    } else {
      res.status(200).json(results);
    }
  });
});

//get only gods with name that contain the query
app.get("/api/gods/contain", (req, res) => {
  connection.query(
    "SELECT name, ases, childs, creation_date FROM gods WHERE name LIKE ?",
    [`%${req.query.name}%`],
    (err, results) => {
      if (err) {
        res.status(500).json({
          error: err.message,
          sql: err.sql,
        });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//get only gods with name that begins by the query
app.get("/api/gods/begins", (req, res) => {
  connection.query(
    "SELECT name, ases, childs, creation_date FROM gods WHERE name LIKE ?",
    [`${req.query.name}%`],
    (err, results) => {
      if (err) {
        res.status(500).json({
          error: err.message,
          sql: err.sql,
        });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//get only gods with creation_date > query(format date = yyyy-mm-dd)
app.get("/api/gods/last", (req, res) => {
  connection.query(
    "SELECT name, ases, childs, creation_date FROM gods WHERE creation_date > ?",
    [req.query.date],
    (err, results) => {
      if (err) {
        res.status(500).json({
          error: err.message,
          sql: err.sql,
        });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//get all gods but order by dates
app.get("/api/gods/date/:order", (req, res) => {
  if (req.params.order === "asc") {
    connection.query(
      "SELECT name, ases, childs, creation_date FROM gods ORDER BY creation_date ASC",
      (err, results) => {
        if (err) {
          res.status(500).json({
            error: err.message,
            sql: err.sql,
          });
        } else {
          res.status(200).json(results);
        }
      }
    );
  }
  if (req.params.order === "desc") {
    connection.query(
      "SELECT name, ases, childs, creation_date FROM gods ORDER BY creation_date DESC",
      (err, results) => {
        if (err) {
          res.status(500).json({
            error: err.message,
            sql: err.sql,
          });
        } else {
          res.status(200).json(results);
        }
      }
    );
  }
});

//add a new god to the BDD (need name(varchar), ases(boolean) and childs(int))
app.post("/api/gods", (req, res) => {
  connection.query("INSERT INTO gods SET ?", [req.body], (err, results) => {
    if (err) {
      res.status(500).json({
        error: err.message,
        sql: err.sql,
      });
    } else {
      res.status(201).send("Added successfully");
    }
  });
});

//update a god data
app.put("/api/gods/:id", (req, res) => {
  connection.query(
    "UPDATE gods SET ? WHERE id = ?",
    [req.body, req.params.id],
    (err, results) => {
      if (err) {
        res.status(500).json({
          error: err.message,
          sql: err.sql,
        });
      } else {
        res.status(200).send("Updated successfully");
      }
    }
  );
});

//toggle a god's boolean
app.put("/api/gods/bool/:id", (req, res) => {
  connection.query(
    "UPDATE gods SET ases = !ases WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        res.status(500).json({
          error: err.message,
          sql: err.sql,
        });
      } else {
        res.status(200).send("Boolean correctly toggle");
      }
    }
  );
});

//delete a gods
app.delete("/api/gods/:id", (req, res) => {
  connection.query(
    "DELETE FROM gods WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        res.status(500).json({
          error: err.message,
          sql: err.sql,
        });
      } else {
        res.status(200).send("Correctly deleted");
      }
    }
  );
});

//delete all gods where boolean is false
app.delete("/api/gods", (req, res) => {
  connection.query("DELETE FROM gods WHERE ases = false", (err, results) => {
    if (err) {
      res.status(500).json({
        error: err.message,
        sql: err.sql,
      });
    } else {
      res.status(200).send("all gods with ases = false was deleted correctly");
    }
  });
});

//you can change process.env.Port by 3000 if you don't want to create .env file
app.listen(process.env.PORT, (err) => {
  if (err) {
    throw new Error("Something bad happened...");
  }
  console.log(`Server is listening on ${process.env.PORT}`);
});
