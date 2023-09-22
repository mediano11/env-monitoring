const express = require("express");

const PORT = 5000;
const app = express();

app.get("/", (req, res) => {
    res.status(200).json("server works")
});

app.listen(PORT, () => console.log('server started on port: ', PORT));