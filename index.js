const express = require("express");
const app = express();
const urlRoute = require("./routes/url");
const staticRouter = require("./routes/staticRouter");
const PORT = 8002;
const path = require("path");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
app.use(express.urlencoded({extended:false}));
app.use(express.json());

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() => console.log("mongo db connected"));
app.use('/url', urlRoute);
app.use('/', staticRouter);
app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));

app.get("/test", async (req, res) => {
    try {
        const allUrls = await URL.find({});
        res.render("home", {
            data: allUrls
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred");
    }
});

app.get("/url/:shortid", async (req, res) => {
    const shortId = req.params.shortid;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, {
        $push: {
            visitHistory: { timestamp: Date.now() }
        }
    });
    res.redirect(entry.redirectUrl);
});
app.listen(PORT, () => {
    console.log(`Server started at Port ${PORT}`);
})