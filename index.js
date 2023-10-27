const express = require("express");
const AppRoutes = require("./src/routes");
const app = express();
app.use(express.json());
// app.get('/',(req,res)=> {
//     res.send("Hello")
// })
app.use("/", AppRoutes);
app.listen(8000, () => console.log("Server is listening to port 8000"));
