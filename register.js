const express = require("express");
const mongoose = require('mongoose')
const app = express();
app.use(express.urlencoded({ extended: true }))
const path = require('path');
const ejs = require('ejs')

app.use(express.static(path.join(__dirname, 'static')));


app.set("views", path.join(__dirname, "/views"))
app.set("view engine", "ejs")


main().then(res => {
    console.log("Connection successfully")
})
    .catch(err => {
        console.log(err);
    })

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Registration")
}

const registerSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Username: {
        type: String,
        required: true,
    },
    Address: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    Created_at: {
        type: Date,
        required: true,
    }
})

const Userdata = mongoose.model("Userdata", registerSchema)

// Booking database

const bookingSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    uPassword: {
        type: String,
        required: true,
    },
    Total_Tickets: {
        type: Number,
        required: true,
    },

    DateOfJourney: {
        type: String,
        required: true,
    }
})

const Bookeduser = mongoose.model("Bookeduser", bookingSchema)


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})


app.get('/temple.html', (req, res) => {
    res.sendFile(path.join(__dirname, "temple.html"))
})

app.get('/trekking.html', (req, res) => {
    res.sendFile(path.join(__dirname, "trekking.html"))
})

app.get('/familyTrip.html', (req, res) => {
    res.sendFile(path.join(__dirname, "familyTrip.html"))
})

app.get('/boatTrip.html', (req, res) => {
    res.sendFile(path.join(__dirname, "boatTrip.html"))
})

app.get('/bikeRiding.html', (req, res) => {
    res.sendFile(path.join(__dirname, "bikeRiding.html"))
})

app.get('/historical.html', (req, res) => {
    res.sendFile(path.join(__dirname, "historical.html"))
})

app.get('/bookingPage.html', (req, res) => {
    res.sendFile(path.join(__dirname, "bookingPage.html"))
})


app.get('/loginPage/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, "loginPage/register.html"))
})


app.get('/loginPage/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, "loginPage/login.html"))
})


app.post('/store', (req, res) => {

    var { fname, uname, add, pas } = req.body
    let username = uname
    Userdata.findOne({ Username: uname })
        .then((data1) => {
            if (data1 == null) {
                var reg = new Userdata({
                    Name: fname,
                    Username: uname,
                    Address: add,
                    Password: pas,
                    Created_at: new Date(),
                })
                reg.save()
                    .then(() => {

                        res.render("index.ejs", { username })
                    })
            }
            else {
                res.send(`<h1>Such username is already in use. Give different username</h1>`)
            }
        })


})

app.post("/loggedin", (req, res) => {
    let username = req.body.username;
    let pass = req.body.pass;
    Userdata.findOne({ Username: username, Password: pass })
        .then((data) => {
            // console.log(data)
            // res.send("working")
            if (data == null) {
                res.send(`<h1>Such user does not exist</h1>`)
            }
            else {
                console.log(data)
                // res.redirect("http://127.0.0.1:8080/index.html")
                res.render("index.ejs", { username })
            }
        })
        .catch(() => {
            res.status(401).send(`<h1>Invalid username or password</h1>`);
        })
})


app.post('/booked', (req, res) => {
    var { username, pas, tTickets, bookdate } = req.body

    Userdata.findOne({ Username: username, Password: pas })
        .then(data => {
            if (data == null) {
                res.send("Enter correct username or password")
            }
            else {
                var book = new Bookeduser({
                    Name: username,
                    uPassword: pas,
                    Total_Tickets: tTickets,
                    DateOfJourney: bookdate,
                })
                book.save()
                    .then(() => {
                        res.render("index.ejs",{username})
                    })
            }
        })

    // var book = new Bookeduser({
    //     Name: username,
    //     uPassword: pas,
    //     Total_Tickets: tTickets,
    //     DateOfJourney: bookdate,
    // })
    // book.save()
    //     .then(() => {
    //         res.redirect("http://127.0.0.1:8080/index.html")
    //     })

})

app.listen(8080, () => {
    console.log("Listening on port 8080")
})