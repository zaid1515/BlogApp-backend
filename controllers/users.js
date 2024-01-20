const { User } = require('../models')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')
// JWTs are often used as a secure way to transmit information about a user between parties. When a user logs in, a server can issue a JWT containing user claims (such as user ID, roles, or other relevant information). The client can then include this JWT in subsequent requests to prove its identity without having to send credentials like a username and password with each request.
const signUp = async (req, res) => {
     try {

          const email = req.body.email
          const checkMail = await User.findOne({ where: { email: email } });
          if (checkMail) {
               res.status(409).json({msg:"Email already exists!"})
          }
          else{

               const password = req.body.password
               // Hash the password using bcrypt
               const hashedPassword = await bcryptjs.hash(password, 10);
               // 10 is the number of salt rounds
               // "salt" is random data that is generated and combined with the user's password before hashing. The purpose of a salt is to add randomness to the hashing process, making it more difficult for attackers to use precomputed tables (rainbow tables) or other techniques, like dictionary attacks, to crack passwords.
               // A "salt round" refers to the number of times the hashing function is applied to the password and salt combination. 

               const user = {
                    name: req.body.name,
                    email: email,
                    password: hashedPassword
               }
               const newUser = await User.create(user);

               res.status(200).json({ success: true, msg:"User created successfully",newUser: newUser })

          }

     } catch (e) {
          console.log(e);
          res.status(500).json({ success: false, msg: e })
     }
}

const login =async(req,res)=>{
     try {
          const user=await User.findOne({where:{email:req.body.email}})

          if (!user) {
               res.status(401).json({success:false,msg:"Invalid Credentials"})
          }
          else {
               // Compare the entered password with the hashed password from the database
               const matchPassword=await bcryptjs.compare(req.body.password,user.password)

               if (matchPassword) {
                    const token=jwt.sign({
                         email:user.email,
                         userId:user.id
                    },process.env.jwt_secret_key,{expiresIn:"1h"})
                    console.log(req.headers);
                    res.status(200).json({success:true,
                         msg:"Authentication successful!",
                         token:token
                    })
               }
               else {
                    res.status(401).json({success:false,msg:"Invalid Credentials"})
               }
          }

     } catch (e) {
          console.log(e);
          res.status(500).json({ success: false, msg: e })
     }
}

module.exports = { signUp ,login}