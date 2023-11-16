const express= require("express");
const app= express();
const router= require("./routers/routes");
require("./db/db");
const cors= require("cors");
const port= process.env.PORT || 8000;


app.use(cors());
app.use(express.json());
app.use(router);

app.get("/", (req,res)=>{
    res.status(200).json("express running...");
});

app.listen(port, ()=>{
    console.log("Server running...");
})