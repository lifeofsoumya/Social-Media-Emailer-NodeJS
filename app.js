const express = require('express')
const puppeteer = require('puppeteer');
const mailer = require('nodemailer')

const app = express();

var instUrl = 'https://www.instagram.com/lifeofsoumya' // defining the scrape-able url

async function scrapeChannel(url) { // init function with to be scraped url argument

    const browser = await puppeteer.launch();      // launch puppeteer
    const page = await browser.newPage();       // generate a headless browser
    await page.goto(url);      // open argument passed url

    const postCount = await page.$$('.v1Nh3');  // using the classes that every post contains, to count number of posts
        console.log(`post count is ${postCount}`)

    const imageHref = await page.evaluate(() => { // function to get link of profile picture
        return document.querySelector('._6q-tv').getAttribute('src').replace('/', '')
    })

    const profPic = await page.goto(instUrl + imageHref)  // creates profile picture image url
    console.log(`link of profile picture is ${profPic}`)

    // const buffer = await profPic.buffer()
    // await writeFileAsync(path.join(__dirname, 'profPic.png'), buffer) // saves the profile picture
}


scrapeChannel(instUrl)



app.get('/', (req, res)=>{
    res.send('Working')
})


const port = process.env.PORT || 3000; 
app.listen(port, ()=>{console.log(`Listening to port ${port}`)})