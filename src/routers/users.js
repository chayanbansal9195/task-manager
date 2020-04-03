const User = require("../models/users");
const express = require("express");
const router = new express.Router();
const auth = require("../middlewares/auth");
const multer=require("multer")
const sharp = require("sharp")
const {sendCancelMail,sendWelcomeMail}=require("../emails/account")
// getting me user
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send();
  }
  //   User.find({})
  //     .then(users => {
  //       res.send(users);
  //     })
  //     .catch(err => {
  //       res.status(500).send();
  //     });
});
// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const user = await User.findById(_id);
//     if (!user) {
//       res.status(404).send();
//     }
//     res.send(user);
//   } catch (e) {
//     res.status(500).send();
//   }

//   // User.findById(_id).then(user=>{
//   //     if(!user){
//   //         res.status(404).send()
//   //     }
//   //     res.send(user)
//   // }).catch((e)=>{
//   //     res.status(500).send()
//   // })
// });

router.get("/users/:id/avatar",async(req,res)=>{
  try{
    const user=await User.findById(req.params.id)
    if(!user||!user.avatar){
      throw new Error()
    }
    res.set("Content-Type","image/png")
    res.send(user.avatar)
  }catch(e){
    res.status(404).send(e)
  }
})

router.post("/users", async (req, res) => {
  const newUser = new User(req.body);
  try {
    await newUser.save();
    sendWelcomeMail(newUser.email,newUser.name)
    const token = await newUser.generateAuthToken();
    res.status(201).send({ newUser, token });
  } catch (e) {
    res.status(400).send(e);
  }
  //   newUser
  //     .save()
  //     .then(() => {
  //       res.status(201).send(newUser);
  //     })
  //     .catch(error => {
  //       res.status(400).send(error);
  //     });
});

router.post("/users/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

// router.patch("/users/:id", async (req, res) => {
//   const _id = req.params.id;
//   const updateUser = Object.keys(req.body);
//   const allowedUpdates = ["name", "email", "age", "password"];
//   const isValidOperation = updateUser.every(update =>
//     allowedUpdates.includes(update)
//   );
//   if (!isValidOperation) {
//     return res.status(400).send({ error: "Invalid Updates" });
//   }
//   try {
//     const user = await User.findById(_id);

//     updateUser.forEach(update => (user[update] = req.body[update]));
//     await user.save();

//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });


const upload=multer({
  // dest:"avatars",
  limits:{
    fileSize:1000000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpeg|jpg|png)$/)){
      return cb(new Error("Please upload an image"))
    }
    return cb(undefined,true)
  }
})
// multer
router.post("/users/me/avatar",auth,upload.single("avatar"),async(req,res)=>{
  const buffer =await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
  req.user.avatar=buffer
  await req.user.save()
  res.send()
},(error,req,res,next)=>{
  res.status(400).send({error:error.message})
})



router.patch("/users/me", auth, async (req, res) => {
  const updateUser = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "age", "password"];
  const isValidOperation = updateUser.every(update =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates" });
  }
  try {
    updateUser.forEach(update => {
      req.user[update] = req.body[update];
    });
    await req.user.save();

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});
// router.delete("/users/:id", async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const user = await User.findByIdAndDelete(_id);
//     if (!user) {
//       return res.status(400).send();
//     }
//     res.send(user);
//   } catch (e) {
//     res.status(404).send(e);
//   }
// });
router.delete("/users/me", auth, async (req, res) => {

  try {
    await req.user.remove();
    sendCancelMail(req.user.email,req.user.name)
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/users/me/avatar",auth,async(req,res)=>{
  req.user.avatar=undefined
  await req.user.save()
  res.send()
})


module.exports = router;
