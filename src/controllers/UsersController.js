const { hash, compare } = require('bcryptjs');
const knex = require('../database/knex');
const AppError = require('../utils/AppError');


class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;
    const hashedPassword = await hash(password, 8);

    //Selecionar todos os usuários onde o email é igual ao email do req.body
    const checkEmailExists = await knex('users').select('*').where({email});

    if(checkEmailExists.length > 0){
      throw new AppError('Este e-mail já está em uso.');;
    }
    
    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json();
  }

  async update(req, res) {
    const { name, email, password, old_password } = req.body;
    const { id } = req.params;

    const user = await knex('users').select('*').where({id});

    if(user.length === 0) {
      throw new AppError('Usuário não encontrado.');
    }

    const userWithUpdatedEmail = await knex('users').select('*').where({email})

    if(userWithUpdatedEmail[0] && userWithUpdatedEmail[0].id !== user[0].id) {
      throw new AppError('Este e-mail já está em uso.');
    }

    user[0].name = name ?? user[0].name;
    user[0].email = email ?? user[0].email;

    if(password && !old_password) {
      throw new AppError('Você precisa informar a senha antiga para definir a nova senha!')
    }

    if(password && old_password) {
      const checkOldPassword = await compare(old_password, user[0].password);

      if(!checkOldPassword) {
        throw new AppError('A senha antiga não confere.');
      }

      user[0].password = await hash(password, 8);
    }

    await knex("users").where({id}).update({
      name: user[0].name,
      email: user[0].email,
      password: user[0].password,
      updated_at: new Intl.DateTimeFormat('pt-br', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(new Date())
    })

    res.status(201).json();
  }
}

module.exports = UsersController;