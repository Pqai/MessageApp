const fs = require('fs').promises;
const exists = require('fs').exists;
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { lstat } = require('fs');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));
app.use('/message', express.static('message'));

app.get('/', (req, res)=> {
    const filePath = path.join(__dirname, 'page', 'message.html');
    res.sendFile(filePath);
});

app.get('/exists', (req, res)=>{
    const filePath = path.join(__dirname, 'page', 'exists.html');
    res.sendFile(filePath);
})

app.post('/create', async(req, res) =>{
    const title = req.body.title;
    const text = req.body.text;

    const tempFilePath = path.join(__dirname, 'temp', title + '.txt');
    const finalFilePath = path.join(__dirname, 'message', title + '.txt');

    await fs.writeFile(tempFilePath, text);
    exists(finalFilePath, async(exists) =>{
        if(exists){
            res.redirect('/exists');
        }
        else{
            // await fs.rename(tempFilePath, finalFilePath);
            await fs.copyFile(tempFilePath, finalFilePath);
            await fs.unlink(tempFilePath);
            res.redirect('/');
        }
    });
});


app.listen(3000);



//this is after npm install and node server.js
// To build docker build .
// To run docker run -p 3000:3000 (KEY)
// To find the name docker ps
// TO stop docker stop (NAME)
// docker build -t message-node:volume .
// docker run -d -p 3000:3000 --rm --name message-app -v message2:/app/message message-node:volume2 //To create the volume with name //The name in this example is message2

//docker run -d -p 3000:3000 --rm --name message-app -v /app/message message-node:volume2 //To create the volume without name
//using --rem will remove anonymous volumes automatically when a container is removed
// To clear  the unused anonymous volumes you can use docker volume prune



// docker run -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts 