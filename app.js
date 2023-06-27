const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mogoose = require("mongoose");
require('dotenv').config()
const { default: mongoose } = require("mongoose");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const posts = [];
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const uri = "mongodb://127.0.0.1:27017/Blogging";
mongoose.connect(uri).then(() => {
    console.log("Connection was SuccessFull");
  })
  .catch((err) => {
    console.log(err);
  });

const bloggingSchema = new mogoose.Schema({
  title : String,
  text : String
})

const newBlog = new mongoose.model("blog",bloggingSchema);

app.get("/", function (req, res) {
  // res.render("home", {
    // homeStartingContent: homeStartingContent,
    // posts: posts,
    // const update =[];
    const findQuery = async () => {
      let find = await newBlog.find().then(function (foundItems) {
        res.render("home",{
          homeStartingContent:homeStartingContent,
          posts :foundItems
        })
      })
    };
    findQuery();
    

  // });
});

app.get("/about", (req, res) => {
  res.render("about", {
    aboutContent: aboutContent,
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent,
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const postTitle = req.body.postTitle;
  const postBody = req.body.postBody;

  // const post = {
  //   postTitle: postTitle,
  //   postBody: postBody,
  // };
  const createPost =  async()=>{
    const postToPublish = await newBlog.create({
      title: postTitle,
      text : postBody
    })
    posts.push(postToPublish);
  }
  createPost();
  console.log(posts);
  res.redirect("/");
});

app.get("/posts/:postId", function (req, res) {
  const flag = (req.params.postId);
  console.log(flag);
  const findBlog = async()=>{
    const finder = await newBlog.findOne({_id:flag}).then(function(items){

      // const search = _.lowerCase(items.title);
      // console.log(items);
      // if(flag === items._id)
      // {
        res.render("post",{
          title : items.title,
          body : items.text
        })
      // }
    });
    // console.log(finder);
  }
  findBlog();

  // var check = 0;
  // for (let i = 0; i < posts.length; i++) {
  //   const storedTitle = _.lowerCase(posts[i].postTitle);
  //   const title = posts[i].postTitle;
  //   const body = posts[i].postBody;
  //   if (storedTitle === flag) {
  //     check = 1;
  //     res.render("post", {
  //       title: title,
  //       body: body,
  //     });
  //   }
  // }
  // if(check === 0)
  // {
  //   alert("Not Found!!");
  // }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
