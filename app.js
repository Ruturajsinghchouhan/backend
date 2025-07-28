import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';


const app = express();

//To link application level middleware
import userRouter from './router/user.router.js';

//To read a body content load the configuration body parser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended":"true"}));


// Routes

app.use(cors());
//Application Level Middileware
app.use("/user",userRouter);
import searchRouter from './router/search.route.js';
app.use('/search', searchRouter);





app.listen(3001);
console.log("Server invoked at linked http://localhost:3001");
