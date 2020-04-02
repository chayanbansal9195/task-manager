require("../src/db/mongoose")
const User = require("../src/models/users");
const Task = require("../src/models/tasks");

// users UPDATE
// User.findByIdAndUpdate("5e83563b8730d26720a1edc6",{age:1}).then(user=>{
//     console.log(user)
//     return User.countDocuments({age:1})
// }).then(count=>{
//     console.log(count)
// }).catch(e=>{
//     console.log(e)
// })  

// TASKS UPDATE
// Task.findByIdAndUpdate("5e8356738730d26720a1edc7",{completed:true}).then(task=>{
//     console.log(task)
//     return Task.countDocuments({completed:true})
// }).then(count=>{
//     console.log(count)
// }).catch(e=>{
//     console.log(e)
// })  



// using asyn await update user

const updateAndCount=async(_id,age)=>{
    const user =await User.findByIdAndUpdate(_id,{age});
    const count = await User.countDocuments({age})
    return count
}
updateAndCount("5e833a23eb211f699c030024",2).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})

// await async to delete task
const deleteAndCount=async(_id,completed)=>{
    const task =await Task.findByIdAndDelete(_id);
    const count = await Task.countDocuments({completed})
    return count
}
deleteAndCount("5e834b1473baa765504d9b22",true).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})