//packages
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

//set tempalte 
app.set("view engine", "ejs");
app.use(express.static("public"));

//parse html data for POST request
app.use(express.urlencoded({
    extended: true
}))

app.use(express.json());

app.get("/", (req, res)=> {
    res.render("index")
})

app.post("/convert-mp3", async (req, res)=> {
    const videoId = req.body.videoID;
    if(videoId === undefined || videoId === "" || videoId === null) {
        return res.render("index", {success : false, message : "Please enter a video ID"});
    }
    else {
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, { 
            "method" : "GET",
            "headers" : {
                "x-rapidapi-key" : "4c73d59859msh79fd72bada95635p157af7jsnb98e32829c48",
                "x-rapidapi-host" : "youtube-mp36.p.rapidapi.com"
            }
        });

        const fetchResponse = await fetchAPI.json();

        if(fetchResponse.status === "ok") {
            return res.render("index", {success : true, song_title : fetchResponse.title, song_link : fetchResponse.link})
        }
        else {
            return res.render("index", {success : false, message: fetchResponse.msg})
        }
    }
})



//start server
app.listen(PORT, () => {
    console.log(`Server start on port ${PORT}`);
})