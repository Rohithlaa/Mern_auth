const express = require("express");
const userModel = require("./userModel");
const jwt = require("jsonwebtoken");
const router = express.Router();


function isAuthenticated( req, res ,next) {
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, "secret" , (err, user) =>{
            if(!user) return res.json({message : "user is not authenticated"})
            else next()
        })
    }
}

router.get('/protected', isAuthenticated, async ( req, res) => {
    
    return res.json({message: "This is protected Route"})
})

router.post("/login", async (req, res) => {
  const { username, password } = req.body.data;
  if (!username || !password) return res.json({ message: "invalid Creds" });
  const user = await userModel.findOne({ username: username });
  if (user) {
    if (user.password === password) {
      const payload = {
        username,
      };
      jwt.sign(payload, "secret", { expiresIn: "1d" }, (err, token) => {
        if (err) console.log(err);
        else {
          res.cookie("jwt", token);
          return res.json({ message: "User logged In !", token: token });
        }
      });
    } else {
      return res.json({ message: "Incorrect password" });
    }
  } else {
    return res.json({ message: "Incorrect credentials" });
  }
});

router.post("/signup", async (req, res) => {
  const { username, password } = req.body.data;
  console.log(req.body.data);
  if (!username || !password) return res.json({ message: "invalid Creds" });
  const userExists = await userModel.findOne({ username: username });
  if (userExists) return res.json({ message: "User already Exists" });
  else {
    const newUser = new userModel({
      username,
      password,
    });
    newUser.save();
    return res.json({ message: "User is Created", newUser });
  }
});

module.exports = router;
