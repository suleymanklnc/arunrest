import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send('İndex Sayfası 2');
});


app.listen(port, () => {
    console.log(`àpplication running on port : ${port}`);//sonra silinecek
});