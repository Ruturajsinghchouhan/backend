import '../model/connection.js';
import url from 'url';
import jwt from 'jsonwebtoken';
import rs from 'randomstring';
import userSchemaModel from '../model/user.model.js';

 export var save =async(req,res)=>{
  
    var userList = await userSchemaModel.find();
    console.log("bgjsknldmg");
    var len =userList.length;
     var _id = (len==0)?1:userList[len-1]._id+1;
   var userDetail ={...req.body,"_id":_id,"role":"user","status":1,"info":Date()};  
   try{
    const users =await userSchemaModel.create(userDetail);
    res.status(201).json({"status":"Resoure reated successfully"});
   }
   catch(err)
   {
    //console.log(err);
    res.status(500).json({"status":"false"});
   }
   }

   export const fetch = async(req,res)=>{
    //  console.log("h1");
     var condition_obj = url.parse(req.url,true).query;
      //console.log(condition_obj);
      var user =await userSchemaModel.find(condition_obj);
      //console.log(user);
     if(user.length!=0)
      {
        res.status(200).json(user);
      }
      else
      {
        res.status(404).json({"result":"user not found in database"});
      }

  }

  export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with active status = 1
    const userList = await userSchemaModel.find({ email, password, status: 1 });

    if (userList.length > 0) {
      const payload = { subject: userList[0].email };

      const token = jwt.sign(payload, 'mysecretkey123', { expiresIn: '1d' });

      res.status(200).json({
        token: token,
        userList: userList[0],
      });
    } else {
      res.status(401).json({ status: false, message: 'Invalid login' });
    }
  } catch (err) {
    res.status(500).json({ status: false, message: 'Server Error' });
  }
};


export const updateProfile = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const user = await userSchemaModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (password) user.password = password;

    await user.save();

    res.status(200).json({ status: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ status: false, message: 'Server Error' });
  }
};

