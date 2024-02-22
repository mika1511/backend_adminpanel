const express = require("express");
const app = express();
const PORT = 5050 ;
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

const loginRouter = require('./routes/login')
const CustomerCareRouter = require('./routes/CustomerCare')
app.use('/v1/login', loginRouter);
app.use('/v1/support', CustomerCareRouter );

// app.use((req, res, next) => {
//     console.log('Time: ', Date.now())
//     next()
//   })
  
  
//   // define the about route
//   app.get('/v1/login/', (req, res) => {
//     res.send('my login page')
//   })



app.get("/v1", (req, res) => {
    try {
        res.status(200).json({
            status: "success",
            data: [],
            message: "Welcome to our API homepage!",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});