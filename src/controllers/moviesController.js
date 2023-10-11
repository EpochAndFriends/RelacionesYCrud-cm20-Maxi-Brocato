const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');



//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        Genres.findAll()
        .then(genres=> {
            res.render('moviesAdd', {genres})
        }).catch(error => console.log(error))
        
    },
    create: function (req,res) {
        const {title, rating, awards, release_date,length, genreId} = req.body;
        Movies.create({title, rating, awards, release_date,length, genreId})
        .then(() => {
            res.redirect("/movies")
        }).catch(error => console.log(error))

    },
    edit: function (req, res) {
        const movieId = req.params.id;
        Movies.findByPk(movieId, {
            include: {
                model: Genres,
                as: "genre"
            }
        })
        .then(movie => {
            Genres.findAll()
            .then(genres => {
                res.render("moviesEdit", { movie, genres });
            })
        })
        .catch(error => console.log(error));
    },
    
    
    
    update: function (req, res) {
        const movieId = req.params.id;
        const { title, rating, awards, release_date, length, genreId } = req.body;
    
        const formatedReleaseDate = moment(release_date).format('YYYY-MM-DD');
    
        Movies.update(
            {
                title,
                rating,
                awards,
                release_date: formatedReleaseDate,
                length,
                genreId
            },
            {
                where: {
                    id: movieId
                }
            }
        )
        .then(() => {
            res.redirect("/movies");
        })
        .catch(error => console.log(error));
    },

    delete: function (req,res) {
        const movieId = req.params.id;
        Movies.findByPk(movieId)
        .then(movie => {
            res.render('moviesDelete', {movie})
        }).catch(error => console.log(error))

    },
    destroy: function (req,res) {
        const movieId = req.params.id;
        Movies.destroy({ 
            where:{
                id: movieId
            }
        }).then(() => {
            res.redirect("/movies")
        }).catch(error => console.log(error))

    }
}

module.exports = moviesController;