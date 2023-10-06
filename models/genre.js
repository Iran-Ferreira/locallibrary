const mongoose = require("mongoose")

const Schema = mongoose.Schema

const GenreSchema = new Schema({
name: { type: String, ref: "Genre", required: true, max: 100  },

})

GenreSchema.virtual("url").get(function(){
    return `/catalog/genre/${this._id}`
})

module.exports = mongoose.model("Genre", GenreSchema)