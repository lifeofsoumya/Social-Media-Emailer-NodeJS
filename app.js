const express = require('express')
const puppeteer = require('puppeteer');
const mailer = require('nodemailer')

const app = express();

var postNumber
var imageHref

var instUrl = 'https://www.instagram.com/lifeofsoumya' // defining the scrape-able url

async function scrapeChannel(url) { // init function with to be scraped url argument

    const browser = await puppeteer.launch();      // launch puppeteer
    const page = await browser.newPage();       // generate a headless browser
    await page.goto(url);      // open argument passed url

    // instead of getting images by counting one by one, using instagram's default posts count section

    const [el] = await page.$x('/html/body/div[1]/section/main/div/header/section/ul/li[1]/a/div');        // select specific element on the url fetched page with 'Full xpath' & assign it to el
    const text = await el.getProperty('textContent');       // choose type of data needed
    const postCounter = await text.jsonValue();    // extract the data type

    postNumber = parseInt(postCounter.replace('posts', ''))

    console.log(postNumber)

    // const postCount = await page.$$('.v1Nh3');  // using the classes that every post contains, to count number of posts
    //     console.log(`post count is ${postCount}`)

    //     const countPost = await page.evaluate(() => {
    //         let data = [];
    //         let elements = document.getElementsByClassName('v1Nh3');
    //         for (var element of elements)
    //         data.push(element.textContent);
    //         console.log(`post count is ${data.length}`)
    //         return data;
    //     })        


    // function to get link of profile picture

    imageHref = await page.evaluate(() => { 
        return document.querySelector('._6q-tv').getAttribute('src').replace('/', '') 
        })
    console.log(`link of profile picture is ${imageHref}`)

    // const profPic = await page.goto(instUrl + imageHref) // creates profile picture image url
    // const buffer = await profPic.buffer() // saves image to buffer temp
    // await writeFileAsync(path.join(__dirname, 'profPic.png'), buffer) // saves the profile picture
}

scrapeChannel(instUrl)



app.get('/', (req, res)=>{
    res.send(`Post Count is ${postNumber} & Dp link is ${imageHref}`)
})


const port = process.env.PORT || 3000; 
app.listen(port, ()=>{console.log(`Listening to port ${port}`)})