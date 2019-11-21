const express = require('express');
var _ = require('lodash');
const axios = require('axios');

const router = express.Router();

const API_KEY = "79dc059f";
const API_URL = "http://www.omdbapi.com/";

movies = [/*{
    id: '0',
    movie: 'Seven Sisters'
},
{
    id: '2 ',
    movie: 'Captain Marvel'
},*/
]


/* GET all movies */
router.get('/', (req, res) => {
    res.status(200).json({
        movies
    });
});

/* GET one movie */
router.get('/:id', (req, res) => {
    const { id } = req.params;
    // Find user in DB
    const movie = _.find(movies, ["id", id]);
    // Return user
    res.status(200).json({
        message: 'Movie found!',
        movie
    });
});

/* PUT new movie 
router.put('/', (req, res) => {
    // Get the data from request from request
    const { movie } = req.body;
    // Create new unique id
    const id = _.uniqueId();
    // Insert it in array (normaly with connect the data with the database)
    movies.push({ movie, id });
    // Return message
    res.json({
        message: `Just added ${id}`,
        movies
    });
});*/

/* PUT new movie axios method */
router.put('/', (req,res) => {
    const { name } = req.body;

    axios.get(`${API_URL}?t=${name}&apikey=${API_KEY}`).then(({data}) => {
        const id = _.uniqueId();

        let movie = data.Title;
        let yearOfRelease = data.Year;
        let duration = data.Runtime;
        let actors = data.Actors;
        let poster = data.Poster;
        let boxOffice = data.BoxOffice;
        let rottenTomatoesScore = data.Ratings[1].Value;

        const db = { 
            "id": id,
            "movie" : movie,
            "yearOfRelease" : yearOfRelease,
            "duration" : duration,
            "actors" : actors,
            "poster" : poster,
            "boxOffice" : boxOffice,
            "rottenTomatoesScore" : rottenTomatoesScore
        };

        movies.push(db);
        
        res.json({
            message: `Just added ${movie}`,
            movies
        });        
    })
})


/* DELETE movie */
router.delete('/:id', (req, res) => {
    // Get the :id of the user we want to delete from the params of the request
    const {
        id
    } = req.params;

    // Remove from "DB"
    _.remove(movies, ["id", id]);

    // Return message
    res.json({
        message: `Just removed ${id}`
    });
});

/* UPDATE movie */
router.post('/:id', (req, res) => {
    // Get the :id of the user we want to update from the params of the request
    const {
        id
    } = req.params;
    // Get the new data of the user we want to update from the body of the request
    const {
        movie
    } = req.body;
    // Find in DB
    const userToUpdate = _.find(movies, ["id", id]);
    // Update data with new data (js is by address)
    userToUpdate.movie = movie;

    // Return message
    res.json({
        message: `Just updated ${id} with ${movie}`
    });
});


module.exports = router;