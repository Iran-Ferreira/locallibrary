const Author = require("../models/author")
const Book = require("../models/book")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

// Exibir lista de todos os autores.
exports.author_list = asyncHandler(async (req, res, next) =>{
    const allAuthors = await Author.find().sort({ family_name: 1 }).exec()
    res.render("author_list", {
        title: "Author List",
        author_list: allAuthors
    })
})

// Exibir página de detalhes de um autor específico.
exports.author_detail = asyncHandler(async (req, res, next) =>{
    const [author, allBooksByAuthor] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({ author: req.params.id }, "title summary").exec(),
    ])
    if(author == null ){
        const err = new Error("Author not found")
        err.status = 404
        return next(err)
    }

    res.render("author_detail", {
        title: "Author Detail",
        author: author,
        author_books: allBooksByAuthor
    })
})

// Exibir formulário de criação do autor em GET.
exports.author_create_get = asyncHandler(async (req, res, next) => {
    res.render("author_form", { title: "Create Author" })
})

// Lidar com a criação do autor no POST
exports.author_create_post = [

    body("first_name").trim().isLength({ min: 1 }).escape().withMessage("First name must be specified").isAlphanumeric().withMessage("First name has non-Alphanumeric characters."),
    body("famiy_name").trim().isLength({ min: 1 }).escape().withMessage("Family name must be specified").isAlphanumeric().withMessage("Family name has non-alphanumeric characters"),
    body("date_of_birth, Invalid date of birth").optional({ values: "falsy" }).isISO8601().toDate(),
    body("date_of_death", "invalid date of death").optional({ values: "falsy" }).isISO8601().toDate(),

    // Processar solicitação após validação
    asyncHandler(async (req, res, next) =>{
    
        // Extraia os erros de validação de uma solicitação.
        const errors = validationResult(req)

        // Cria um objeto de Author com dados de escape e cortados.
        const author = new Author({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
        })

        if(!errors.isEmpty()){
            // Existem erros. Renderize o formulário novamente com valores/erros consertados
            res.render("author_form", {
                title: "Create Author",
                author: author,
                errors: errors.array(),
            })
            return
        }else{
            // Os dados do formulário são válidos.

            // Salvar autor.
            await author.save()
            
            // Redirecionar para o novo registro do autor.
            res.redirect(author.url)
        }

    }),
]

// Exibir formulário de exclusão de autor em GET.
exports.author_delete_get = asyncHandler(async (req, res, next) => {
    // pegar detalhes do autor e dos livros em paralelo
    const [author, allBooksByAuthor] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({ author: req.params.id }, "title summary").exec(),
    ])

    if(author === null){
        // Nenhum resultado
        res.redirect("/catalog/authors")
    }

    res.render("author_delete", {
        title: "Delete Author",
        author: author,
        author_books: allBooksByAuthor,
    })

})

// Lidar com exclusão de autor no POST
exports.author_delete_post = asyncHandler(async (req, res, next) => {
    // pegar detalhes do autor e dos livros em paralelo
    const [author, allBooksByAuthor] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({ author: req.params.id }, "title summary").exec(),
    ])

    if(allBooksByAuthor.length > 0){
        // Autor tem livros. Renderize da mesma maneira que para a rota GET 
        res.render("author_delete", {
            title: "Delete Author",
            author: author,
            author_books: allBooksByAuthor,
        })
        return

    }else{
        // Autor não tem livros. Excluir objeto e redirecionar para a lista de autores
        Author.findByIdAndRemove(req.body.authorid)
        res.redirect("/catalog/authors")
    }
})

// Exibir fomrnulário de atualização em GET
exports.author_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author update GET")
})

// Lidar com atualização de autor no POST
exports.author_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author update POST")
})
