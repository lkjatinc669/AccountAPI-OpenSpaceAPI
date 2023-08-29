const express = require('express');

app = express()

app.get("/", (req, res)=>{
    res.send("Pass => " + fet(req.query))
})

function fet(r) {
    er=""
    var data = (r.id) ? true: er="asd";false;
    return data+er
}

// ngrok http --domain=logical-suitable-bobcat.ngrok-free.app 80

app.listen(3000);