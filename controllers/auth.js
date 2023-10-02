// auth controller
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {

    // TL;DR - Validação ativa no mongo mas deixa ai
    // Validação de envio dos dados via controller, desativado para fazer pelo mongodb
    // const { name, email, password } = req.body
    // if (!name || !email || !password) {
    //     throw new BadRequestError('Please provide name, email and password.')
    // }

    const user = await User.create({ ...req.body })
    const token = user.createJwt()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password.')
    }
    const user = await User.findOne({ email })
    // if para usuario não mandou credenciais validas
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials.')
    }

    // code for comparing the password TODO
    const IS_PASSWORD_CORRECT = await user.comparePassword(password)

    if (!IS_PASSWORD_CORRECT) {
        throw new UnauthenticatedError('Invalid credentials.')
    }

    const token = user.createJwt()
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = {
    register,
    login
}
