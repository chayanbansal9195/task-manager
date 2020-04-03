const express = require("express");

// mongoose files
require("./db/mongoose");

// routers
const userRouter=require("./routers/users")
const taskRouter=require("./routers/tasks")

// constants variables
const app = express();


// postman json body
app.use(express.json());

// routes------------

// user
app.use(userRouter)

// tasks
app.use(taskRouter)

module.exports=app

