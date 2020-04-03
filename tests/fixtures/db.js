const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/users")
const Task = require("../../src/models/tasks")
const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: "Daniel",
  email: "chayanbansal1999@gmail.com",
  password: "123asdqwe!",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
};
const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: "assda",
    email: "sdasas@gmail.com",
    password: "123asdqwe!",
    tokens: [
      {
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
      }
    ]
  };
  const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "sdaffx SZDFgx ASDFdsgd",
    completed:false,
    owner: userOne._id,
    
  };
  const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "ams ads ASDFdsgd",
    completed:true,
    owner: userOne._id,
    
  };
  
const setUpDatabase=async()=>{
    await User.deleteMany();
    await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
}

module.exports={
    userOne,
    userOneId,
    userTwoId,
    taskOne,
    taskTwo,
    setUpDatabase
}