/*Project 5: Guessing Game
Name: Toni Ojeda
JS file for server-side
*/
let express = require("express"); //Initializing express modules
let app = express(); //Initializing express object
app.use(express.static("Public")); //Setting up client side folder
console.log("Server Started");
app.get("/getRandom", function (req, res) {
  let randomNumber = Math.floor(Math.random() * 100) + 1; //setting up random number
  console.log("Sending random Number: " + randomNumber);
  res.send(JSON.stringify(randomNumber)); //sending response back to client
  console.log("-------------------------");
});
app.listen(5810); //listening at port 5810
