const bcryptjs = require('bcryptjs');
const db = require('../database/models');
const {Book , User , Author}= require("../database/models");


const mainController = {
  home: (req, res) => {
    db.Book.findAll({
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        res.render('home', { books });
      })
      .catch((error) => console.log(error));
  },
  bookDetail: (req, res) => {
    // Implement look for details in the database

    const bookId = req.params.id
     Book.findByPk(bookId, {
      include: [{ association: "authors"}]})
      .then((books) => {
        const authors = books.authors.map((authors) => authors.name);
        const isAdminLoggedIn = req.cookies.admin === 'admin';
          return res.render('bookDetail', {
              books,
              authors,
              isAdminLoggedIn
          })
      })
      .catch(err => console.log(err))
  
  },
  bookSearch: (req, res) => {
    res.render('search', { books: [] });
  },
  bookSearchResult: (req, res) => {
    // Implement search by title
    const searchTitle = req.body.title;
      Book.findAll({
        where: {
          title: {
            [db.Sequelize.Op.like]: `%${searchTitle}%`
          }
        },
        include: [{ association: 'authors' }]
      })
        .then((books) => {
          res.render('search', { books });
        })
        .catch((error) => console.log(error));
    res.render('search');
  },
  deleteBook: (req, res) => {
    // Implement delete book
    Book.destroy({
      where: {
          id: req.params.id
      }
  })
    res.render('home');
   
  },
  authors: (req, res) => {
    Author.findAll()
      .then((authors) => {
        res.render('authors', { authors });
      })
      .catch((error) => console.log(error));
  },
  authorBooks: (req, res) => {
    // Implement books by author
    Author.findByPk(req.params.id, {
      include: [{ association: 'books' }]
    })
    .then((author) => {
      res.render('authorBooks', {author});
    })
    .catch((error) => console.log(error));
  
  },
  register: (req, res) => {
    res.render('register');
  },
  processRegister: (req, res) => {
    User.create({
      Name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcryptjs.hashSync(req.body.password, 10),
      CategoryId: req.body.category
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => console.log(error));
  },
  login: (req, res) => {
    // Implement login process

    res.render('login');
  },
  processLogin: (req, res) => {
    // Implement login process
    let userLogin;
    let passwordUser
    db.User.findAll()
      .then(users => {
        userLogin = users.find(user => user.Email.toLowerCase() === req.body.email.toLowerCase());
          if(userLogin) {
            passwordUser = bcryptjs.compareSync(req.body.password, userLogin.Pass)
          }
          if(passwordUser){
            let nameId = userLogin.Name

            res.cookie('login', true)
            res.cookie('admin', userLogin.CategoryId)
            res.cookie('name', nameId)
            res.redirect('/');
          }
      })
  },
  
  logout: (req, res) => {

    res.clearCookie("login")
    res.clearCookie("admin")
    res.clearCookie("name")
    res.redirect('/')
    
  
},    
  edit: (req, res) => {
    // Implement edit book
    Book.findByPk(req.params.id, {
      include: [{ association: 'authors' }]
    })
      .then((book) => {
        const isAdminLoggedIn = req.cookies.admin === 'admin';
        res.render('editBook', { book,isAdminLoggedIn  });
      })
      .catch((error) => console.log(error));
  },
  processEdit: (req, res) => {
    // Implement edit book
    res.render('home');
  }
};

module.exports = mainController;
