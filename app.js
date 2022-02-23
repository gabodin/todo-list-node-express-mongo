
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const {Todos, List } = require("./Todo");
const _ = require("lodash");
// const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/todoDB");



app.get("/", async function(req, res) {
    try {
        const todos = await Todos.find();
        res.render("list", {listTitle: "Today", newListItems: todos});
    }
    catch(err) {
        console.log(err.message);
    }
});

app.post("/", async function(req, res) {
    let item = req.body.newItem;
    const listName = req.body.list; 

    const todo = new Todos({
        title: item
    });

    if(listName === "Today") {
        try {
            const savedTodo = await todo.save();
            console.log(savedTodo)
            res.redirect("/")
        }
        catch(err) {
            console.log(err.message);
        }
    } 
    else {
        try {
            List.findOne({name: listName}, async function(err, foundList) {
                foundList.items.push(todo);
                await foundList.save();
                res.redirect("/" + listName);
            })
        } catch(err) {
            console.log(err.message);
        }
    }

    
});

app.post("/delete", async function(req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName; 
    
    if( listName === "Today") {
        try {
            const removedTodo = await Todos.findByIdAndRemove(checkedItemId);
        }
        catch(err) {
            console.log(err.message)
        }
        res.redirect("/");
    } else {
        try {
            await List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}});
            res.redirect("/" + listName);
        } catch(err) {
            console.log(err.message);
        }
    }


});

app.get("/:customListName", async function(req, res) {
    const customListName = _.capitalize(req.params.customListName);
    
    const todo = new Todos({
        title: "teste"
    });

    const items = [todo];

    List.findOne({name: customListName}, function(err, foundList) {
        if(!err) {
            if(!foundList) {   
                console.log("tetando")            
                const list = new List({
                    name: customListName,
                    items: items
                });
            
                list.save();

                res.render("list", {listTitle: customListName, newListItems: items});                          
            } else {
                console.log("teste");
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
            }
        }
    }); 

});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});