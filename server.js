const dotenv = require('dotenv')
const mongoose = require('mongoose')

process.on('uncaughtException', err=>{
    console.log('UNCAUGHT EXCEPTION..Shutting down...');
    console.log(err.name, err.message);
    process.exit(1)
})

dotenv.config({ path: './config.env' })
const app = require('./app')
mongoose.connect(process.env.DATABASE_LOCAL)
    .then(() => console.log('database connected successfully...'))

// console.log(process.env)nodemon server.js
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`app running on ${port}`)
})

process.on('unhandledRejection', err=>{
    console.log('UNHANDLED REJECTION..Shutting down...');
    console.log(err.name, err.message);
    server.close(()=>{
        process.exit(1)
    })
})



