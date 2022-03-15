const express = require('express')
const mailer = require('nodemailer')

const app = express();

const port = process.env.PORT || 3000; 


app.get('/', (req, res)=>{
    res.send('Project init')
})
app.listen(port, ()=>{console.log(`Listening to port ${port}`)})