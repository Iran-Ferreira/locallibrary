const mongoose = require("mongoose")
const { DateTime } = require("luxon")

const Schema = mongoose.Schema

const AuthorSchema = new Schema({
    first_name: { type: String, required: true, max: 100 },
    family_name: { type: String, required: true, max: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
})

// Vizualição do nome do autor
AuthorSchema.virtual("name").get(function(){
    // To avoid errors in cases where an author does not have either a family name or first name
    // We want to make sure we handle the exception by returning an empty string for that case
    let fullname = ""
    if (this.first_name && this.family_name){
        fullname = `${this.family_name}, ${this.first_name}`
    }
    return fullname
})

// Vizualização da vida do autor
AuthorSchema.virtual("lifespan").get(function(){
    
    const birthDate = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
    const deathDate = DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)

    return `${birthDate} - ${deathDate}`

    
    /* return(
        DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)     
        
        // Colocar datas de morte do autor
        // Colocar mensagens de erros quando o autor não tiver data
    ); */
})

// Virtual for author URL
AuthorSchema.virtual("url").get(function(){
    return `/catalog/author/${this._id}`
})

module.exports = mongoose.model("Author", AuthorSchema)