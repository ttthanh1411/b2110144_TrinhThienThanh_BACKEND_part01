const express = require("express");
const cors = require("cors");
const res = require("express/lib/response");
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) =>{
    res.json({
        message: "Welcome to contact book application."
    });
});
module.exports = app;