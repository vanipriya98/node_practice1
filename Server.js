const express = require('express');
const app = express();
const mongoose = require('mongoose');
const devuser = require('./devusermodel');
const jwt=require('jsonwebtoken')
const middleware = require('./middleware')
const cors =require('cors')

// Middleware to parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors ({origin :'*'}))

mongoose.connect("mongodb+srv://vani:vani12345@cluster0.alovxrv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => { console.log("DB Connected") })
    .catch(err => console.log(err));

app.get('/hello', (req, res) => {
    return res.send("Hello World");
});

app.post('/register', async (req, res) => {
    try {
        const { fullName, email, mobile, skill, password, confirmPassword } = req.body;
        if (!fullName || !email || !mobile  || !password || !confirmPassword) {
            return res.status(400).send('All fields are required');
        }
        const exist = await devuser.findOne({ email });
        if (exist) {
            return res.status(400).send('User already exists');
        }
        if (password !== confirmPassword) {
            return res.status(403).send('Passwords do not match');
        }
        const newUser = new devuser({
            fullName, email, mobile, skill, password, confirmPassword
        });
        await newUser.save();
        return res.status(200).send("User registered successfully");
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({message : err.message});
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const exist = await devuser.findOne({ email });
        if (!exist) {
            return res.status(400).send('User not exist');
        }
        if (exist.password !== password) {
            return res.status(403).send('Invalid Password');
        }
        const payload = {
            user: {
                id: exist.id
            }
        };
        jwt.sign(payload, 'jwtPassword', { expiresIn: 3600000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error');
    }
});

app.get('/allprofiles' , middleware,async(req ,res)=>{
    try{
     let allprofiles=await devuser.find()
     return res.json(allprofiles)
    }
    catch (err) {
        console.log(err);
        return res.status(500).send('Server Error');
    }
})

app.get('/myprofile' , middleware , async(req, res) =>{
    try{
     let myprofile = await devuser.findById(req.user.id)
     return res.json(myprofile)
    }
    catch (err) {
        console.log(err);
        return res.status(500).send('Server Error');
    }
})

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
