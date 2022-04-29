const app = require('./app');
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const cloudinary = require('cloudinary');

//handling uncaught exception
process.on("uncaughtException",(err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught exception`);
    process.exit(1);
})

dotenv.config({path:"config/config.env"})

// Connecting to database

connectDatabase();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const server = app.listen(process.env.PORT, () => {
    console.log(`Server  is working on http://localhost:${process.env.PORT} `)

})



//unhandle rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    })
})

