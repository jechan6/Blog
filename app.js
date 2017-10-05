var express          = require("express"),
    bodyParser       = require("body-parser"),
    methodOverride   = require("method-override"),
    mongoose         = require("mongoose"),
    expressSanitizer = require("express-sanitizer"),
    app              = express();
    
mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//Model Config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})
var Blog = mongoose.model("Blog", blogSchema);

/*Blog.create({
    name: "New Dog",
    image: "http://cdn2-www.dogtime.com/assets/uploads/gallery/golden-retriever-dogs-and-puppies/golden-retriever-dogs-puppies-6.jpg",
    body: "I just got a new dog named Poke!"
})*/
app.get("/", function(req, res) {
    res.redirect("/blogs");
})

// RESTFUL ROUTES


//INDEX ROUTE
app.get("/blogs", function(req,res){
    Blog.find({}, function(err, blogs) {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {blogs:blogs});
        }
    })
})
//NEW ROUTE
app.get("/blogs/new", function(req, res) {
    res.render("new");
})
//CREATE ROUTE
app.post("/blogs", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req,res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog:foundBlog});
        }
    })
})
//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog:foundBlog});
        }
    })
})

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, newBlog) {
        if(err) {
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/" + req.params.id);
        }
    })
})
//DESTROY ROUTE
app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs");
        }
    })
})

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("The server is now running!");
})