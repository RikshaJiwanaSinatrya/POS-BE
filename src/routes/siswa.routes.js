const express = require('express')
const router = express.Router()

const siswaModel = require('../models/siswa.model')
const siswaController = require('../controllers/siswa.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const allowRoles = require('../middlewares/role.middleware')

router.get('/', authMiddleware, allowRoles('admin'), async (req, res) => {
  const data = await siswaModel.findAll()
  res.json({ status: 'success', data })
})


router.get('/detail/:id', authMiddleware, allowRoles('admin'), async (req, res) => {
  const data = await siswaModel.findById(req.params.id)
  res.json({ status: 'success', data })
})

router.post('/', authMiddleware, allowRoles('admin'), siswaController.create)

router.put('/:id', authMiddleware, allowRoles('admin'), siswaController.update)

router.delete('/:id', authMiddleware, allowRoles('admin'), siswaController.delete)

module.exports = router
