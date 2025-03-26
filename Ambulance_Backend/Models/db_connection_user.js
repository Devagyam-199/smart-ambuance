const mongoose = require('mongoose')
const mongo_url = process.env.MONGO_CONN

mongoose.connect(mongo_url)
    .then(()=>(
        console.log(`connection sucessful to user db`)
    )).catch((err)=>{
        console.log(`connecion failed : ${err}`);
        
    })