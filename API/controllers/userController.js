import {User} from '../model/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// user register
export const register = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill all inputs" });
    }
    console.log(name, email, password )
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(402).json({ message: "user allready exist", success: false })

        //   password hash  
        const hashpass = await bcrypt.hash(password, 10)
        user = await User.create({ name, email, password: hashpass });
        res.json({ massege: "user registration successfull...!", success: true, user })
    } catch (err) {
        console.log('erorr controller', err)
    }

}



// user login
export const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "Please fill all inputs" });
    }
    try {
        let user = await User.findOne({ email });

   if (!user) {
    return res.status(400).json({ 
        message: "This user does not exist", 
        success: false 
    });
  }

        const validpassword = await bcrypt.compare(password, user.password);
        if (!validpassword)
            return res.status(400).json({ message: "invalid credential", success: false })

        const jwtSecret = process.env.JWT_SECRET;
        const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '30d' })
        res.json({ message: `Login succesfull- welcome ${user.name} `, token, success: true })

    } catch (er) {
        console.log(er)
    }
}