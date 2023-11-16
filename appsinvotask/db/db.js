const mongoose = require("mongoose");

const DB= "mongodb+srv://gaurabhkumarjha:27102002@cluster0.e3lwsbo.mongodb.net/appsinvonodejsassignment?retryWrites=true&w=majority";
mongoose.set("strictQuery", false);
mongoose.connect(DB,{

    useUnifiedTopology: true,
    useNewUrlParser:true
     
}).then(()=> console.log("Database connected..")).catch((err)=>{
    console.log(err);
})