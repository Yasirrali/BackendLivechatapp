const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();
const Pusher = require("pusher");
const path = require('path')

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

//static files 
app.use(express.static(path.join(__dirname, './client/build')))

app.get('*', function(req,res){
  res.sendFile(path.join(__dirname, './client/build/index.html'))
})

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = pusher(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});


const pusher = new Pusher({
  appId: "1663306",
  key: "4f078f496fba5b6af9a9",
  secret: "e3851381157c332e6488",
  cluster: "ap2",
  useTLS: true
});

pusher.trigger("my-channel", "my-event", {
  message: "hello world"
});
