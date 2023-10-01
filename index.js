const express = require("express");
require('dotenv').config();
const router = require("./router");

const PORT = 5000;
const app = express();
app.set("view engine", "ejs");
app.use(express.json());    

app.use("/", router);

const startApp = async () => {
    try {
        app.listen(PORT, () => console.log('server started on port: ', PORT));
    } catch (error) {
        res.render("pages/error", { error });
    }
}

startApp()