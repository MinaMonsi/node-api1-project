// BUILD YOUR SERVER HERE
const express = require('express')
//granting  server.js access to the funtions in the users-model
const Users = require("./users/model")

//Instantiating the server
const server = express()

//Global Middleware
server.use(express.json())

//ENDPOINTS
//POST | /api/users | Creates a user using the information sent inside the `request body`
server.post("/api/users", (req,res)=>{
    const newUser = req.body
    if(!newUser || !newUser.bio){
        res.status(400).json({message:"Please provide name and bio for the user"})
    }else{
        Users.insert(newUser)
        .then(createdUser=>{
            res.status(201).json(createdUser)
        })
        .catch(err=>{
            res.status(500).json({
                message:'There was an error while saving the user to the database',
                err: err.message
            })
        })
    }
})

//GET | /api/users | Returns an array users
server.get("/api/users", (req,res)=>{
    Users.find()
    .then(users => {
        console.log(users)
        res.status(200).json(users)
    })
    .catch(err=>{
        res.status(500).json({message: "The users information could not be retrieved",
        err: err.message
    })
    })
})

//GET | /api/users/:id	Returns the user object with the specified id
server.get("/api/users/:id", (req,res)=>{
    const idVar = req.params.id
    Users.findById(idVar)
    .then(user => {
        if(!user){
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        }else{
            res.json(user)
        }
    })
    
    .catch(err=>{
        res.status(500).json({message: "The user information could not be retrieved"})
    })
})
//DELETE | /api/users/:id	Removes the user with the specified id and returns the deleted user.
server.delete("/api/users/:id", async (req,res)=>{
    try{
        const existingUser = await Users.findById(id)
        if(!existingUser){
            res.status(404).json({message: "The user with the specified ID does not exist" })
        }else{
            const deletedUser = await Users.remove(existingUser.id)
            res.status(201).json(deletedUser)
        }
    }catch(err){
        res.status(500).json({message: "The user could not be removed"})
    }
})
//PUT |	/api/users/:id	Updates the user with the specified id using data from the request body. Returns the modified user
server.put("/api/users/:id", async(req,res)=>{
    const {id} = req.params
    const changes = req.body
    try{
        if(!changes.name || !changes.bio){
            res.status(400).json({ message: "Please provide name and bio for the user" })
        }else{
            const updatedUser = await Users.update(id, changes)
            if(!updatedUser){
                res.status(404).json({message:"The user with the specified ID does not exist"})
            }else{
                res.status(200).json(updatedUser)
            }
        }   
    }catch(err){
        res.status(500).json({
            message:"Error deleting user",
            err: err.message,
            stack: err.stack,
        })
    }

})


module.exports = server; // EXPORT YOUR SERVER instead of {}
