
const shortid = require('shortid');
const URL = require("../models/url");
async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: 'Url is required' });
    const shortId = shortid.generate();

    const url = await URL.create({
        shortId: shortId,
        redirectUrl: body.url,
        visitHistory: []

    });

    return res.render('home', {
        id: url.shortId,
    })

}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.json({
        totalClick: result.visitHistory.length,
        analytics: result.visitHistory
    });

}
module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics
}