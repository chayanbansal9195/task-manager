const app=require("./indexTest")

const port = process.env.PORT;

// middleware
// app.use((req,res,next)=>{
//   if(req.method==="GET"){
//    res.status(404).send("GET requests are disabled")
//   }
//   else{
//     res.status(503).send("We are in maintenance mode")
//   }
// })



// connect server
app.listen(port, () => {
  console.log("Server connected at port " + port);
});


// relationship between users and tasks

// const Task=require("./models/tasks")
// const User=require("./models/users")

// const main=async()=>{
// const task = await Task.findById('5e8597f54002712414c64bac')
//  await task.populate("owner").execPopulate()
// console.log(task.owner)

// const user = await User.findById('5e858fa6ec7dad2380ae55e6')
//  await user.populate("tasks").execPopulate()
// console.log(user.tasks)

// }
// main()
