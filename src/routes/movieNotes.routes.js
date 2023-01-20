const { Router } = require('express');

const MovieNotesController = require('../controllers/MovieNotesController');
const movieNotesController = new MovieNotesController();

const movieNotes = Router();

movieNotes.post('/:user_id', movieNotesController.create);
movieNotes.get('/:id', movieNotesController.show);
movieNotes.delete('/:id', movieNotesController.delete);


module.exports = movieNotes;