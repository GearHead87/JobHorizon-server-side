const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        //   'https://solosphere.web.app',
    ],
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// verify jwt middleware
const verifyToken = (req, res, next) => {
    const token = req.cookies?.token
    if (!token) return res.status(401).send({ message: 'unauthorized access' })
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.log(err)
                return res.status(401).send({ message: 'unauthorized access' })
            }
            req.user = decoded
            next();
        })
    }
}

// mongoDB database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ahe248t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const db = client.db("JobHorizonDB");
        const jobsCollection = db.collection('jobs')
        const appliedJobsCollection = db.collection('appliedJobs')


        //creating JWT Token
        app.post("/jwt", async (req, res) => {
            const user = req.body;
            // console.log("user for token", user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

            res.cookie("token", token, cookieOptions).send({ success: true });
        });

        //clearing JWT Token
        app.post("/logout", async (req, res) => {
            const user = req.body;
            console.log("logging out", user);
            res
                .clearCookie("token", { ...cookieOptions, maxAge: 0 })
                .send({ success: true });
        });

        // API Services
        app.get('/jobs', async (req, res) => {
            const search = req.query.search;
            let query = {}
            if (search) {
                query = {
                    jobTitle: { $regex: search, $options: 'i' }
                }
            }

            const result = await jobsCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/job/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jobsCollection.findOne(query);
            res.send(result);
        })

        app.put('/job/:id', async (req, res) => {
            const id = req.params.id;
            const jobData = req.body;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    ...jobData,
                },
            }
            console.log(jobData);
            const result = await jobsCollection.updateOne(query, updateDoc, options)

            res.send(result);
        })

        app.delete('/job/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jobsCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/add-job', async (req, res) => {
            const jobData = req.body;
            // console.log(jobData);
            const result = await jobsCollection.insertOne(jobData);
            res.send(result);
        })

        app.get('/my-jobs/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email }
            const result = await jobsCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/applied-jobs/:email', async (req, res) => {
            const email = req.params.email;
            const filter = req.query.filter;
            let query = {}
            query = { 'application.applicantUserEmail': email }
            if (filter) {
                query.jobCategory= filter 
                
            }
            console.log(filter, query);
            
            const result = await appliedJobsCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/apply-job', async (req, res) => {
            const jobData = req.body;
            // console.log(jobData);

            // Check Duplicate Request
            const query = {
                applicantUserEmail: jobData.applicantUserEmail,
                jobId: jobData.jobId,
            }
            const alreadyApplied = await appliedJobsCollection.findOne(query);
            console.log(alreadyApplied)
            if (alreadyApplied) {
                return res.status(400).send({ message: "You have already applied on this job." })
            }

            const result = await appliedJobsCollection.insertOne(jobData);
            // console.log(result)
            // Increase Applicant Number
            const updateDoc = {
                $inc: { jobApplicantsNumber: 1 }
            }
            const jobQuery = { _id: new ObjectId(jobData.jobId) }
            const updateJobApplicantsNumber = await jobsCollection.updateOne(jobQuery, updateDoc)
            // console.log(updateJobApplicantsNumber);
            res.send({ message: "success" });

        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Your Server is Running');
})

app.listen(port, () => {
    console.log(`Server is running on: http://localhost:${port}/`);
})