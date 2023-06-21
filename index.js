const express = require('express');
const mongoDb = require('./db');
const app = express();

//setting up cors headers
app.use((req,res,next)=>{
  // Set the "Access-Control-Allow-Origin" header to allow requests from "http://localhost:3000"
  
    res.setHeader("Access-Control-Allow-Origin","http://localhost:3000")
    // Set the "Access-Control-Allow-Headers" header to allow specific headers in cross-origin requests
 
res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
)
// Call the "next()" function to pass the request to the next middleware or route handler
  
next()
})
// app.get('/', (req, res) => {
//   res.send("hello world");
// });

app.use(express.json());

app.use('/api', require('./Routes/CreateUser'));
mongoDb().then(() => {
  app.listen(8000, () => {
    console.log("Server started");
  });
}).catch((error) => {
  console.error('Failed to connect to MongoDB', error);
});
