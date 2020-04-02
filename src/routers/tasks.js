const Task = require("../models/tasks");
const User = require("../models/users");
const express = require("express");
const router = new express.Router();
const auth=require("../middlewares/auth")


// check for completed and filtering accordingly 
// GET ?completed:true
// pagination
// GET ?limit=10&skip=10
// sorting
// GET ?sortBy=createdAt:desc
router.get("/tasks",auth, async (req, res) => {
  const match={}
  const sort={}

  if(req.query.completed){
    match.completed=req.query.completed==='true'
  }
  if(req.query.sortBy){
    const parts=req.query.sortBy.split(':')
    sort[parts[0]]=parts[1]==="desc"?-1:1
  }
  try {
    // const tasks = await Task.find({});
    await req.user.populate({
      path:'tasks',
      match,
      options:{
        limit:parseInt(req.query.limit),
        skip:parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }
  // Task.find({}).then(tasks=>{
  //     res.send(tasks)
  // }).catch((err)=>{
  //     res.status(500).send()
  // })
});
router.get("/tasks/:id",auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({_id,owner:req.user._id});
    if (!task) {
      res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
  //   Task.findById(_id)
  //     .then(task => {
  //       if (!task) {
  //         res.status(404).send();
  //       }
  //       res.send(task);
  //     })
  //     .catch(e => {
  //       res.status(500).send();
  //     });
});

router.post("/tasks",auth, async (req, res) => {
  const newTask = new Task({
    ...req.body,
    owner:req.user._id
  });
  try {
    await newTask.save();

    res.status(201).send(newTask);
  } catch (e) {
    res.status(400).send("error");
  }
  //   const newTask = new Task(req.body);
  //   newTask
  //     .save()
  //     .then(() => {
  //       res.status(201).send(newTask);
  //     })
  //     .catch(error => {
  //       res.status(400).send("error");
  //     });
});

router.patch("/tasks/:id",auth, async (req, res) => {
  const _id = req.params.id;
  const updateTask = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updateTask.every(update =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates" });
  }
  try {
      // const task=await Task.findById(_id)
      const task = await Task.findOne({_id,owner:req.user._id})
      
    // const task = await Task.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidator: true
    // });
    if (!task) {
      return res.status(404).send();
    }
    updateTask.forEach((update)=>
          task[update]=req.body[update]
      )
      await task.save()
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/tasks/:id",auth,async(req,res)=>{
    const _id=req.params.id;
    try{
        // const task=await Task.findByIdAndDelete(_id);
        const task=await Task.findOneAndDelete({_id,owner:req.user._id})
        if(!task){
         return res.status(400).send()
        }
        res.send(task)
    }catch(e){
        res.status(404).send(e)
    }
})
module.exports = router;
