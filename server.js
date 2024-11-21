import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParsar from "body-parser"

dotenv.config()

// mongod connection
const connectDB = mongoose.connect(process.env.DB_URL);
// promise solution in connectDB bea it is promise
connectDB.then((resolve)=>{
    console.log("Connect Mongo Db Successfully!")
}).catch((err)=>{
    console.log(err);
})


// Send data in mongodb
    // first create schema
    const userSchema = mongoose.Schema({
        name:{
            type:String
        },
        password:{
            type:String
        }
    })
    // now schema connect to modal to crate collection in mongodb
    const userModel = mongoose.model("User",userSchema)

// console.log(userModel)



// initialize
const app = express()

const port = process.env.PORT;

app.use(bodyParsar.json());
// Routes to use Database for get and post data from request and response

app.get("/", async(req,res)=>{
    
    try {
        const allUserData = await userModel.find()
    console.log(allUserData);
    res.status(200).send({message:"created User List!",allUserData:allUserData});

    } catch (error) {
        res.status(500).send({message:"Not get User list!",error});
    }
})


app.post("/", async(req,res)=>{
    try {
        const {name, password}= req.body;
        console.log(name, password);
        const userData = new userModel({name,password})
        console.log(userData);
        await userData.save();
        res.status(201).send({message:"user created successfully!",userDataSave:userData});
    } catch (error) {
        res.status(500).send({message:"Not  User Created",error});
    }

})


app.put("/:id",async(req,res)=>{

    try {
        const {id}= req.params;
        console.log(id);
        const {name,password} = req.body;
        console.log(name,password);
        const updateData = await userModel.findByIdAndUpdate(id,{name,password},{new:true})
        console.log(updateData);
        res.status(202).send({message:"User update successfully!",userUpdate:updateData})
    } catch (error) {
        res.status(500).send({message:"Not  User update",error});
    }
})
   

app.delete("/:id", async(req,res)=>{
    try {
        const{id}=req.params;
    console.log(id);
    const deleteUser =await userModel.findByIdAndDelete(id);
    console.log(deleteUser);
    res.status(301).send({message:"user deleted successfully!"})
    } catch (error) {
        res.status(500).send({message:"Not  User delete",error});
    }
    
})

// server start on port
app.listen(port,()=>{
    console.log(`server started http://localhost:${port}`)
})

