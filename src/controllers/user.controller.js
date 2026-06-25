const asyncHandler = require('../utils/asyncHandler')
const userService = require('../services/user.service')

exports.create = asyncHandler(async (req, res) => {
  await userService.createUser(req.body)
  res.status(201).json({ message: 'User created' })
})

exports.getAll = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers()
  res.json({ status: 'success', data: users })
})

exports.getById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id)
  res.json({ status: 'success', data: user })
})

exports.delete = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id)
  res.json({ status: 'success', message: 'User deleted' })
})

exports.create = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body)
  res.status(201).json({ status: 'success', message: 'User created', data: user })
})