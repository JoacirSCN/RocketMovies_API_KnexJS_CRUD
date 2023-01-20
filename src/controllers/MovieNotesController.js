const knex = require('../database/knex');
const AppError = require('../utils/AppError');

class MovieNotesController {
  async create(req, res){
    const { title, description, rating, tags } = req.body;
    const { user_id } = req.params;

    if(rating <= 0 || rating > 5) {
      throw new AppError('O Rating do filme deve estar entre 1 e 5');
    }

    const note_id = await knex('movieNotes').insert({
      title,
      description,
      rating,
      user_id
    });

    const movieTagsInsert = tags.map(name => {
      return {
        note_id,
        user_id,
        name
      }
    });

    await knex('movieTags').insert(movieTagsInsert);

    res.json();
  }

  async show(req, res){
    const { id } = req.params;

    const note = await knex('movieNotes').where({ id }).first();
    const tags = await knex('movieTags').where({note_id: id}).orderBy('name');

    return res.json({
      ...note,
      tags
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    await knex('movieNotes').where({id}).delete();

    res.json()
  }
}

module.exports = MovieNotesController;