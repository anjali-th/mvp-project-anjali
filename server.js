require('dotenv').config();
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true})); 


const { Pool } = require ('pg');

// const pool = new Pool ({
//     database: "exercise",
// })

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV ==='production'? {
        rejectUnauthorized: false,
    }: false
});

const PORT = 8000 || process.env.PORT;

// create new user
app.use(express.static('public'));

app.post('/new-user', (req, res)=>{
    const { username } = req.body;

    // edge cases: blank input field

    pool.query('INSERT INTO appUsers (username) VALUES ($1) RETURNING *', [username] , (err, result)=>{
        // const id = result.rows[0].id;
        if (err){
            res.sendStatus(500);
        }
        res.json(result.rows[0]);
    });
});

// user can log workouts

app.post('/log', (req, res)=>{
    const { userId, description, duration, date} = req.body;
    console.log(req.body)
    pool.query('INSERT INTO workout_log (date, workoutname, duration, appusersid) VALUES ($1, $2, $3, $4) RETURNING *', [date, description, duration, userId] , (err, result)=>{
        if (err){
            res.sendStatus(500);
        }
        res.send(result.rows[0]);
        console.log(result.rows)
    });
    
})

// user can get workout log

app.get('/history', (req, res)=>{
    pool.query('SELECT * FROM workout_log', (err, result)=>{
        if (err){
            res.sendStatus(500);
        }
        res.send(result.rows);
    })
})

app.listen(PORT, ()=>{
    console.log (`Listening on port ${PORT}`);
})