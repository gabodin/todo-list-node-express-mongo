const { default: mongoose } = require("mongoose");

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 1,
        required: true,
    }  
})

const listSchema = new mongoose.Schema({
    name: String,
    items: [todoSchema],
})


const Todos = mongoose.model("Todos", todoSchema);
const List = mongoose.model("List", listSchema);

module.exports = {
    Todos: Todos,
    List: List
};