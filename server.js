const express       = require('express');
const bodyParser    = require('body-parser');
const path          = require('path');
const fs            = require('fs');
const http          = require('http');
const app           = express();
const PORT          = 4000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/',express.static(path.join(__dirname,'public')));
app.get('/src.js',function(request,response){
    response.sendFile(path.join(__dirname,'public/src.js'))
})
app.get('/monarch.js',function(request,response){
    response.sendFile(path.join(__dirname,'public/monarch.js'))
})
app.get('/theme.js',function(request,response){
    response.sendFile(path.join(__dirname,'public/theme.js'))
})
app.get('/',function(request,response){
    response.send(path.join(__dirname,'index.html'));
})
http.createServer(app).listen(PORT);
console.log(`Server running in http://localhost:${PORT}/`);