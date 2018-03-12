/* eslint-disable no-console */
// A bit has been changed because fuck having to do shit yourself. - Void
// I'm leaving my statuses and arrangements to show you how it should be set up to function correctly.
//     -The setActivity() function handles 99% of the changes made.
const {
    app,
    BrowserWindow
} = require('electron');
const path = require('path');
const url = require('url');
const DiscordRPC = require('discord-rpc');
const config = require('../../config.json');
const fs = require('fs');
const parse = require('parse-duration')
const moment = require('moment')
var keepAlive = 1;
var spawn = require('child_process').spawn;

if (config.defaultText || config.imageKeys) {
    console.log('ERROR: The config system has been altered since the last update. Please check config.json.example and update your config.\n')
    return app.quit();
}

const ClientId = config.clientID;
var openTimestamp
let mainWindow;

function createWindow() {
    var width = 400 //320
    var height = 150 //500
    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        resizable: true,
        titleBarStyle: 'hiddenInset',
        vibrancy: 'dark',
        hasShadow: false,
        frame: false,
        show: false
    });

    if (config.imageConfig.showButton == true) {
        var height = height + 40
        mainWindow.setSize(width, height);
    }

    if (config.timeConfig.timeType !== 'none') {
        var height = height + 60
        mainWindow.setSize(width, height);
    }

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
    }));

    mainWindow.on('closed', () => {
        if (keepAlive == 1) {
            console.log("Vanity closed, KeepAlive True")
            console.warn("Vanity must run for presence updates.")
        } else {
            mainWindow = null;
            console.log("Vanity closed, KeepAlive False")
            console.warn("Vanity must run for presence updates.")
        }
    });
}

function getDuration() {

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (keepAlive == 1) {
        console.log("AppReady sustained.")
        app.quit();
    } else {
        console.log("AppReady reset, closing.")
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null)
        createWindow();
});

DiscordRPC.register(ClientId);

const rpc = new DiscordRPC.Client({
    transport: 'ipc'
});

async function setActivity() {
    if (!rpc || !mainWindow)
        return;

    var ltext = await mainWindow.webContents.executeJavaScript('var text = "textContent" in document.body ? "textContent" : "innerText";document.getElementById("ltext")[text];')
    //var details = await mainWindow.webContents.executeJavaScript('var text = "textContent" in document.body ? "textContent" : "innerText";document.getElementById("details")[text];')
    //var state = await mainWindow.webContents.executeJavaScript('var text = "textContent" in document.body ? "textContent" : "innerText";document.getElementById("state")[text];')
    var stext = await mainWindow.webContents.executeJavaScript('var text = "textContent" in document.body ? "textContent" : "innerText";document.getElementById("stext")[text];')
    //var lkey = await mainWindow.webContents.executeJavaScript('var text = "textContent" in document.body ? "textContent" : "innerText";document.getElementById("lkey")[text];')
    var skey = await mainWindow.webContents.executeJavaScript('var text = "textContent" in document.body ? "textContent" : "innerText";document.getElementById("skey")[text];')

    var stateArray = ['Petting Nya', 'Feeding Nya', 'Coding Nya', 'Licking Nya', 'Throwing Nya', 'Grooming Nya', 'Patting Nya', 'Making Nya snacks', 'Lewding Nya'];
    var selectedState = stateArray[Math.floor(Math.random() * stateArray.length)];

    switch (selectedState) {
        case "Petting Nya":
        case "Patting Nya":
            detailsArray = ["-purrs-", "Meow", "^w^"]
            var selectedDetails = detailsArray[Math.floor(Math.random() * detailsArray.length)];
            //selectedImage = "nya_pet";
            break;
        case "Feeding Nya":
        case "Making Nya snacks":
            detailsArray = ["Delicious feesh", "wholesome noms", "Cake!"];
            var selectedDetails = detailsArray[Math.floor(Math.random() * detailsArray.length)];
            //selectedImage = "nya_fewd";
            break;
        case "Grooming Nya":
            detailsArray = ["In a bath", "with a comb", "-licks-"];
            var selectedDetails = detailsArray[Math.floor(Math.random() * detailsArray.length)];
            //selectedImage = "nya_groom";
            break;
        case "Coding Nya":
            detailsArray = ["Throwing Errors", "Scratching Variables", "Nomming Functions"]
            var selectedDetails = detailsArray[Math.floor(Math.random() * detailsArray.length)];
            //selectedImage = "nya_coding";
            break;
        case "Licking Nya":
            detailsArray = [">_>", "Y tho", "-licks-"]
            var selectedDetails = detailsArray[Math.floor(Math.random() * detailsArray.length)];
            //selectedImage = "nya_lick";
            break;
        case "Throwing Nya":
            detailsArray = ["AWAAAAA", "NYAAAA!?!?!", "-hiss-"]
            var selectedDetails = detailsArray[Math.floor(Math.random() * detailsArray.length)];
            //selectedImage = "nya_throw";
            break;
        case "Lewding Nya":
            detailsArray = [">/////<", "NYAAAA!?!?!", "-purrs-", ">:3"]
            var selectedDetails = detailsArray[Math.floor(Math.random() * detailsArray.length)];
            //selectedImage = "nya_lewd";
            break;
        default:
            var detailsArray = ['zzzz', 'Meow', 'wholesome noms', 'bweh', 'Void is cool', 'Nya likes licks', '-licks-', 'MEOW MEOW??', '-purrs-', ':3'];
            var selectedDetails = detailsArray[Math.floor(Math.random() * detailsArray.length)];
            //selectedImage = "nya_default"
    }

    var largeKeyArray = ['nya_js', 'nya_smol', 'nya_tot'];
    var selectedImage = largeKeyArray[Math.floor(Math.random() * largeKeyArray.length)];

    var state = selectedDetails;
    var details = selectedState;
    var lkey = selectedImage;


    var activity = {
        details: details,
        state: state,
        largeImageKey: lkey,
        largeImageText: ltext,
        instance: false
    }

    if (skey !== 'none') {
        activity.smallImageKey = skey
        activity.smallImageText = stext
    }

    if (!openTimestamp) {
        openTimestamp = new Date();
    }

    if (config.timeConfig.timeType == 'start') {
        activity.startTimestamp = moment(openTimestamp).add(parse('-' + config.timeConfig.whatTime), 'ms').toDate();
    } else if (config.timeConfig.timeType == 'end') {
        activity.endTimestamp = moment(openTimestamp).add(parse(config.timeConfig.whatTime), 'ms').toDate();
    } else if (config.timeConfig.timeType == 'both') {
        activity.startTimestamp = moment(openTimestamp).add(parse('0s'), 'ms').toDate();
        activity.endTimestamp = moment(openTimestamp).add(parse(config.timeConfig.whatTime), 'ms').toDate();
    }
    rpc.setActivity(activity);
}

rpc.on('ready', () => {
    console.log("Launch Successful, Nya!")
    console.log(" ")
    setActivity();

    setInterval(() => {
        setActivity();
    }, 15e3);
});

rpc.login(ClientId).catch(console.error);
