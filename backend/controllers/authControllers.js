const User = require("../model/User.js");
const bcrypt = require("bcryptjs");
const generateToken = require("../config/token.js");
const { isValidEmail } = require("../utils/validators.js");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login=async(req,res)=>{
    try{
        const {email,password}=req.body;

        if (!email || !password) {
            return res.status(400).json({message:"Email and password are required"});
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({message:"Invalid email format"});
        }

        const user=await User.findOne({email}).select("+password");
        if(!user){
            return res.status(400).json({message:"Invalid User credentials"});
        }

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid User credentials"});
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        })
    }
    catch (error) {
        res.status(500).json({ message: error.message });
  }

}

const getMe = async (req, res) => {
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
    });
};

const getUsers = async (req, res) => {
    try {
        const { search = "" } = req.query;
        const filter = search
            ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            }
            : {};

        const users = await User.find(filter)
            .select("name email role")
            .limit(20)
            .sort({ name: 1 });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports={signup,login,getMe,getUsers};
