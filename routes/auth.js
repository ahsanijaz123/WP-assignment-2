    const express = require('express');
    const router = express.Router();
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    const authMiddleware = require('../middlewares/authMiddleware');

    
    router.post('/signup', async (req, res) => {
      const { username, email, password } = req.body;

      try {
          
          let user = await User.findOne({ email });
          if (user) {
              return res.status(400).json({ message: "User already exists." });
          }

          
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
         
            user = new User({
                username,
                email,
                password: hashedPassword
            });
          await user.save();
         
          res.status(201).json({ message: "User created successfully." });
      } catch (error) {
          console.error("Signup Error:", error);
          res.status(500).json({ message: "Server error" });
      }
    });


    
    router.post('/signin', async (req, res) => {
        const { email, password } = req.body;

      try {
        const user = await User.findOne({ email });

        if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
          user: {
            id: user.id,
          },
        };

        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: 3600 }, 
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (error) {
         console.error("Signin Error:", error);
        res.status(500).json({ message: 'Server error' });
      }
    });


    
    router.get('/protected', authMiddleware, (req, res) => {
      res.json({ message: 'Access granted. You are authenticated!', user: req.user });
    });

    module.exports = router;
    