const { hash, compare } = require('bcryptjs');
const knex = require('../database/knex');
const AppError = require('../utils/AppError');


class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;
    const hashedPassword = await hash(password, 8);

    //Selecionar todos os usuários onde o email é igual ao email do req.body
    let checkEmailExists = await knex('users').select('*').where({email});
    checkEmailExists = checkEmailExists.pop();

    if(checkEmailExists.email === email){
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

    let user = await knex('users').select('*').where({ id });
    user = user.pop();

    if(!user) {
      throw new AppError('Usuário não encontrado.');
    }

    let userWithUpdatedEmail = await knex('users').select('*').where({ email })
    userWithUpdatedEmail = userWithUpdatedEmail.pop();

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este e-mail já está em uso.');
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if(password && !old_password) {
      throw new AppError('Você precisa informar a senha antiga para definir a nova senha!')
    }

    if(password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if(!checkOldPassword) {
        throw new AppError('A senha antiga não confere.');
      }

      user.password = await hash(password, 8);
    }

    await knex("users").where({id}).update({
      name: user.name,
      email: user.email,
      password: user.password,
      updated_at: new Date()
    })

    res.status(201).json();
  }
}

module.exports = UsersController;