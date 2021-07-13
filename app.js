const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mailchimp.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.SERVER_PREFIX
});

app.get("/", function (req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/",function (req,res) {
      const formData = req.body;
      const listId = process.env.LIST_ID;
      const subscribingUser = {
            fName: formData.fName,
            lName: formData.lName,
            email: formData.email
      }
      async function run() {
          try {
              const response = await mailchimp.lists.addListMember(listId, {
                  email_address: subscribingUser.email,
                  status: "subscribed",
                  merge_fields: {
                      FNAME: subscribingUser.fName,
                      LNAME: subscribingUser.lName
                  }
              });
              console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
              console.log(response);
              res.sendFile(__dirname + "/success.html");

          }
          catch(e){
              console.log(e.status);
              res.sendFile(__dirname + "/failure.html");
          }
      };
        run();

});

app.post("/failure", function (req,res){
   res.redirect("/");
});

app.listen(process.env.PORT || 3000, function (){
    console.log("Server is running on port 3000. ")
});

