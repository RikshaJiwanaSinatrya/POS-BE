const crypto = require('crypto')
const bcrypt = require('bcrypt')
const AppError = require('../errors/AppError')
const userModel = require('../models/user.model')

exports.getAllUsers = async () => {
  return await userModel.findAll()
}

exports.getUserById = async (id) => {
  const user = await userModel.findById(id)

  if (!user) {
    throw new AppError('USER_NOT_FOUND', 404)
  }

  return user
}

exports.createUser = async (data) => {
  const { username, password, role } = data
  if (!username || !password || !role) {
    throw Object.assign(new Error('INVALID_PAYLOAD'), { statusCode: 400 })
  }
  const existing = await userModel.findByUsername(username)
  if (existing) {
    throw Object.assign(new Error('Username already exists'), { statusCode: 409 })
  }
  const id = crypto.randomUUID()
  const hashedPassword = await bcrypt.hash(password, 10)
  await userModel.create({ id, username, password: hashedPassword, role })
  return { id, username, role }
}

exports.deleteUser = async (id) => {
  const user = await userModel.findById(id)

  if (!user) {
    throw new AppError('USER_NOT_FOUND', 404)
  }

  await userModel.deleteById(id)
}