const Genre = require("../models/genre")
const Book = require("../models/book")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

// Exibir a lista de todos os gêneros
exports.genre_list = asyncHandler(async (req, res, next) => {
    const allGenres = await Genre.find().sort({ name: 1 }).exec()
    res.render("genre_list", {
        title: "Genre List",
        genre_list: allGenres
    })
})

// Exibe a página de detalhes de um gênero específico.
exports.genre_detail = asyncHandler(async (req, res, next) =>{
    const [genre, booksInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({ genre: req.params.id }, "title summary").exec()
    ])
    if (genre === null) {
        const err = new Error("Genre not found")
        err.status = 404
        return next(err)
    }
    
    res.render("genre_detail", {
        title: "Genre Detail",
        genre: genre,
        genre_books: booksInGenre,
    })
})

// Exibir formulário de criação de gênero em GET.
exports.genre_create_get = asyncHandler(async (req, res, next) => {
    res.render("genre_form", { title: "Create Genre" })
})

// Lida com criação de gênero no POST.
exports.genre_create_post = [ 
    body("name", "Genre name must contain at least 3 characters").trim().isLength({ min: 3 }).escape(),

    // Processar solicitação após validação
    asyncHandler(async (req, res, next) =>{

        // Extraia os erros de validação de uma solicitação.
        const errors = validationResult(req)

        // Cria um objeto de gênero com dados de escape e cortados.
        const genre = new Genre({ name: req.body.name })

        if(!errors.isEmpty()){
            // Existem erros. Renderize o formulário novamente com valores/erros consertados
            res.render("genre_form", {
                title: "Create Genre",
                genre: genre,
                errors: errors.array(),
            })
            return;
        }else{
            // Os dados do formulário são válidos.
            // Verifique se já existe um gênero com o mesmo nome.
            const genreExists = await Genre.findOne({ name: req.body.name }).exec()
            if (genreExists){
                res.redirect(genreExists.url)
            }else{
                await genre.save()
                // Novo gênero salvo. Redirecionar para a página de detalhes do gênero.
                res.redirect(genre.url)
            }
        }
    }),
]

// Exibir formulário de exclusão de gênero em GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) =>{
    res.send("NOT IMPLEMENTED: Genre delete GET")
})

// Lida com exclusão de gênero no POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) =>{
    res.send("NOT IMPLEMENTED: Genre delete POST")
})

// Exibir formulário de atualização de gênero em GET
exports.genre_update_get = asyncHandler(async (req, res, next) =>{
    res.send("NOT IMPLEMENTED: Genre update GET")
})

// Lidar com a atualização de gênero no POST
exports.genre_update_post = asyncHandler(async (req, res, next) =>{
    res.send("NOT IMPLEMENTED: Genre update POST")
})
