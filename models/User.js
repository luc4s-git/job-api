const mongoose = require('mongoose')
const { Schema } = mongoose
require('dotenv').config()

// hashing password
const bcrypt = require('bcryptjs')

// jason web token para sessão
const jwt = require('jsonwebtoken')

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name.'],
        lowercase: true,
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        required: [true, 'Please provide your email adress.'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email adress.'
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide your password.'],
        minLength: 5
    }
})

// .pre realiza a função de hashing da senha antes de salvar no banco de dados
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10)
    // this aponta para o documento
    this.password = await bcrypt.hash(this.password, salt)
})

// jason web token para sessão
UserSchema.methods.createJwt = function () {
    return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

// instance method para comparar as senhas hasheadas uWu
UserSchema.methods.comparePassword = async function (cadidateSecret) {
    const isMatch = await bcrypt.compare(cadidateSecret, this.password)
    // lembrando que o this aponta para o documento ou seja o password que vem
    // é o mesmo do banco de dados
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)
