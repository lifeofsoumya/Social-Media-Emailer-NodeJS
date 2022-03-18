const express = require('express')
const puppeteer = require('puppeteer');
const mailer = require('nodemailer')
const bodyParser = require('body-parser')

const app = express();

app.set('view engine', 'ejs'); // set the view engine to ejs

app.use(bodyParser.urlencoded({extended:true})); //parses incoming request bodies in a middleware before you handle it
app.use(express.static("public")); // use public folder to access static files like css

var postNumber
var flCountNumber
var imageHref
let igDp
var showProfileName

var instUrl = 'https://www.instagram.com/lifeofsoumya' // defining the scrape-able url

async function scrapeChannel(url) { // init function with to be scraped url argument

    const browser = await puppeteer.launch();      // launch puppeteer
    try {
    const page = await browser.newPage();       // generate a headless browser
    await page.goto(url);      // open argument passed url

    // instead of getting images by counting one by one, using instagram's default posts count section

    const [el] = await page.$x('/html/body/div[1]/section/main/div/header/section/ul/li[1]/a/div');        // select specific element on the url fetched page with 'Full xpath' & assign it to el
    const text = await el.getProperty('textContent');       // choose type of data needed
    const postCounter = await text.jsonValue();

    // await page.waitForSelector('your selector')
    // let element = await page.$('your selector')
    // let value = await element.evaluate(el => el.textContent)

    postNumber = parseInt(postCounter.replace(',', ''))


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
    
    
    // Second alternative way to scrape user image
    const [el2] = await page.$x('/html/body/div[1]/section/main/div/header/div/div/span/img');
    const imgDp = await el2.getProperty('src');
    igDp = await imgDp.jsonValue();
    console.log(igDp)
    
    // function to get link of profile picture
    imageHref = await page.evaluate(() => { 
        return document.querySelector('._6q-tv').getAttribute('src').replace('/', '') 
        })
    console.log(`link of profile picture is ${imageHref}`)
    }
    catch (err) {
        console.error(err.message);
    }
    finally {
        await browser.close();
    }

    // const profPic = await page.goto(instUrl + imageHref) // creates profile picture image url
    // const buffer = await profPic.buffer() // saves image to buffer temp
    // await writeFileAsync(path.join(__dirname, 'profPic.png'), buffer) // saves the profile picture
}

scrapeChannel(instUrl)


app.get('/', (req, res)=>{
        res.render("notifier", {postNumberEjs: postNumber, imageHrefFile: igDp, ProfileName: showProfileName});
})

app.post('/', (req, res)=> {
    var profileUrl = req.body.profile;
    var notifyNumber = req.body.notifyNumber;
    showProfileName = profileUrl;

    console.log(profileUrl, notifyNumber)

    // if (profileUrl.includes != "instagram.com"){
    //     profileUrl = "https://instagram.com/" + profileUrl; // validating input of username or url format
    //     instUrl = profileUrl
    //     }

    //     var expression = 
    // /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    //     var regex = new RegExp(expression);
    //     var url = 'https://instagram.com/';

    //     function urlCheck() {
    //         if (url.match(regex)) {
    //             console.log('valid url')
    //         } else {
    //             profileUrl = url + profileUrl;
    //             instUrl = profileUrl
    //         }}
    //         urlCheck()
    
    if (profileUrl.includes('https://instagram.com')){
        console.log('okay url entered')
        profileUrl = profileUrl;
    }
    else{
        profileUrl = "https://instagram.com/" + profileUrl; // validating input of username or url format
        instUrl = profileUrl
    }

    // instUrl = profileUrl

    console.log(instUrl)
    scrapeChannel(instUrl)
    setTimeout(()=>{
    res.redirect('/')
    }, 5000);
    }
)


const port = process.env.PORT || 3000;
app.listen(port, ()=>{console.log(`Listening to port ${port}`)})