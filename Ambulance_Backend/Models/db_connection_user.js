const mongoose = require('mongoose');
require('dotenv').config(); 

const mongo_url = process.env.MONGO_CONN;

if (!mongo_url) {
    console.error("MONGO_CONN is not defined. Check your environment variables.");
    process.exit(1);
}

mongoose.connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connection successful to MongoDB"))
.catch((err) => {
    console.error(`Connection failed: ${err.message}`);
    process.exit(1);
});
