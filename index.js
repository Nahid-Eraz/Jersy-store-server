const express = require('express')
const app = express()
const fileUpload = require('express-fileUpload')
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const port = process.env.PORT || 5005;

app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.buicv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('errors', err)
    const serviceCollection = client.db("riverr-rent").collection("services");
    const reviewCollection = client.db("riverr-rent").collection("reviews");
    const bookingsCollection = client.db("riverr-rent").collection("bookings");

    // send (service) data in to the server
    app.post('/dashboard/addService', (req, res) => {
        const newService = req.body;
        console.log('add service', newService)
        serviceCollection.insertOne(newService)
            .then(result => {
                console.log('insert', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    // get (service) data from server
    app.get('/services', (req, res) => {
        serviceCollection.find()
            .toArray((err, services) => {
                res.send(services)
            })
    })

    //get (service) a single data from server
    app.get('/dashboard/book/:key', (req, res) => {
        serviceCollection.find({ key: req.params.key })
            .toArray((err, services) => {
                res.send(services[0])
            })
    })

    //send (review) data into the server
    app.post('/dashboard/review', (req, res) => {
        const newReview = req.body;
        console.log('add service', newReview)
        reviewCollection.insertOne(newReview)
            .then(result => {
                console.log('insert', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    // get (review) data from server
    app.get('/reviews', (req, res) => {
        reviewCollection.find()
            .toArray((err, reviews) => {
                res.send(reviews)
            })
    })

    //send (bookings) data into the server
    app.post("/dashboard/bookings", (req, res) => {
        const booking = req.body;
        bookingsCollection.insertOne(booking)
        .then(result => {
            console.log('insert', result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    // get (bookings) data from server
    app.get('/allBookings', (req, res) => {
        bookingsCollection.find()
            .toArray((err, booking) => {
                res.send(booking)
            })
    })

    //send (admin) data to the server
    app.post('/dashboard/makeAdmin', (req, res) => {
        const name = req.body.name;
        const email = req.body.email;
        console.log(name, email);
    })

    console.log('database connected successfully')
});




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})