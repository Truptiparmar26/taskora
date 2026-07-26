const express = require("express");
const dotenv = require("dotenv");
const connetDB = require("./config/db");
const cors = require("cors");
dotenv.config();
connetDB();

const app = express();

// app.use(express.json());
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb' }));
app.use(cors());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/notes", require("./routes/noteRoutes"));

app.get("/",(req,res)=>{
    res.send("API is Running...!");
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`);
});