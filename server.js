const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const admin = require("firebase-admin");
const credential = require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(credential)
});

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({ extended: false })); // Baca Form
app.use(express.static("public")); // Baca Direktori Page
app.get("/form", (req, res) => {
  res.sendFile(__dirname + "/public/index.html"); // Baca Direktori Page
});

const db = admin.firestore();

app.post('/create', async (req, res) =>{
    try {
        console.log(req.body);
        const userJson = {
            inputCreate: req.body.inputCreate,
        };
        const response = await db.collection ("userTasks").add(userJson);
        
        res.redirect('/index.html');
    } catch(error){
        res.send(error);
    }
} );

 app.get('/read', async (req, res) =>{
    try {
        const response = await db.collection("userTasks").get();
        const tasks = [];

        response.forEach((doc) => {
            const data = doc.data();
            tasks.push({
              id: doc.id,
              inputCreate: data.inputCreate,
            });
          });
      
          res.send(tasks);
        } catch (error) {
          res.status(500).send(error.message);
        }
      });
      

app.delete('/delete/:id', async (req, res) => {
    try{
        const response = await db.collection("userTasks").doc(req.params.id).delete();
        res.send(response);
    } catch (error){
        res.send(error);
    }
})

// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//     console.log(`Server is running on PORT ${PORT}.`);
// })