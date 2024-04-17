const fs =require('fs')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config({ path: './config.env' })
const Tour = require('../../models/tourModel')
const Review = require('../../models/reviewModel');
const User = require('../../models/userModel');


mongoose.connect(process.env.DATABASE_LOCAL)
    .then(() => console.log('database connected successfully...'))

    //Get all data
    const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))
    const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
    const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'))
    //import all data in DB
    const importData= async()=>{
        try{
            await Tour.create(tours)
            await User.create(users, { validateBeforeSave: false });
            await Review.create(reviews);
            console.log('Data loaded successfully..!')
        }catch(err){
            console.log(err)
        }
    }

    //delete old data in DB
    const deleteData= async()=>{
        try{
            await Tour.deleteMany()
            await User.deleteMany();
            await Review.deleteMany();
            console.log('Data deleted successfully..!')
        }catch(err){
            console.log(err)
        }
    }
    
    if (process.argv[2] === '--import') {
        importData()
    }else if (process.argv[2] === '--delete') {
        deleteData()
    }