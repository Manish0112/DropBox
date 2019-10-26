const express=require('express');
const router=express.Router();
const { ensureAuthenticated }= require('./../config/auth');

//to get data in table
const Files = require('./../models/files');

//Welcome Page
router.get('/',(req,res)=>res.render('welcome'));

//dahsboard Page
router.get('/dashboard',ensureAuthenticated,(req,res)=>{

    const user =req.user;

    if(req.user.name == 'admin'){

        Files.find({ },(err, data) => {
            //console.log(data);
            res.render('dashboard',{
                user: user,
                data: data
            })
        })
    }
    else{
        Files.find({ email : req.user.email },(err, data) => {
            //console.log(data);
            res.render('dashboard',{
                user: user,
                data: data
            })
        })
    }

});



module.exports=router;