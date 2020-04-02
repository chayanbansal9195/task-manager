const mongoose=require("mongoose");


const tasksSchema=new mongoose.Schema({
    description:{
        type:String,
        required:[true,"Add a task"],
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true,
})

tasksSchema.pre("save",async function(next){
    const task=this
    console.log(this)
    next()
})

const Task=mongoose.model("Task",tasksSchema)

module.exports=Task