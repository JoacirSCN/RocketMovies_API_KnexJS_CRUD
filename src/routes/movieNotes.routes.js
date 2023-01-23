const { Router } = require('express');

const MovieNotesController = require('../controllers/MovieNotesController');
const movieNotesController = new MovieNotesController();

const movieNotes = Router();

movieNotes.get('/', movieNotesController.index);// quando eu recebo o user_id pela query(insominia), não preciso passar aqui
movieNotes.post('/:user_id', movieNotesController.create);
movieNotes.get('/:id', movieNotesController.show);
movieNotes.delete('/:id', movieNotesController.delete);


module.exports = movieNotes;