const BookInstance = require("../models/bookinstance")
const Book = require("../models/book")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

// Exibir a lista de todos os BookInstances
exports.bookinstance_list = asyncHandler(async (req, res, next) => {
    const allBookInstances = await BookInstance.find().populate("book").exec()

    res.render("bookinstance_list", {
        title: "Book Instance List",
        bookinstance_list: allBookInstances,
    })
})

// Exibir a página de detalhes para um bookInstance específica
exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
    const bookInstance = await BookInstance.findById(req.params.id).populate("book").exec()

    if(bookInstance === null){
        const err = new Error("Book copy not found")
        err.status = 404
        return next(err)
    }

    res.render("bookinstance_detail", {
        title: "Book",
        bookinstance: bookInstance,
    })
})

// Exibir formulário de criação de BookInstance em GET.
exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
    const allBooks = await Book.find({}, "title").exec()

    res.render("bookinstance_form", {
        title: "Create BookInstance",
        book_list: allBooks,
    })
})

// Lidar com a criação de BookInstance no POST.
exports.bookinstance_create_post = [
    
    //Validar os campos 
    body("book", "Book must be specified.").trim().isLength({ min: 1 }).escape(),
    body("imprint", "Imprint must be specified.").trim().isLength({ min: 1 }).escape(),
    body("status").escape(),
    body("due_back", "Invalid date.").optional({ values: "falsy" }).isISO8601().toDate(),

    // Processar solicitação após validação
    asyncHandler(async (req, res, next) => {
    
        // Extraia os erros de validação de uma solicitação.
        const errors = validationResult(req)

        // Cria um objeto de BookInstance com dados de escape e cortados.
        const bookInstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
        })

        if(!errors.isEmpty()){
            // Existem erros. 
            // Renderize o formulário novamente com valores/erros consertados
            const allBooks = await Book.find({}, "title").exec()

            res.render("bookinstance_form", {
                title: "Create BookInstance",
                book_list: allBooks,
                selected_book: bookInstance.book._id,
                errors: errors.array(),
                bookinstance: bookInstance,
            })
            return

        }else{
            await bookInstance.save()
            res.redirect(bookInstance.url)
        }
    }),
]

// Exibir formulário de exclusão de BookInstance em GET.
exports.bookinstance_delete_get = asyncHandler(async (req, res, next) =>{
    res.send("NOT IMPLEMEND: BookInstance delete GET")
})

// Lidar com exclusão do BookInstance no POST
exports.bookinstance_delete_post = asyncHandler(async (req, res, next) =>{
    res.send("NOT IMPLEMENTED: BookInstance delete POST")
})

// Exibir formulário de atualização do BookInstance em GET.
exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance update GET")
})

// Lidar com atualização de bookinstance no POST.
exports.bookinstance_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance update POST")
})
