const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const app = express();
const PORT = process.env.PORT || 5000;


 
 connectDB();


app.use(express.json()); 


app.use('/api', authRoutes);

 app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
  });