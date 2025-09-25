// const express = require("express")
// const cors = require("cors")
import express from 'express'
import cors from 'cors'
import productRoutes from './routes/product.router'
import usersRoutes from './routes/users.router'

const app = express()
const port = 2000

app.use(express.json())
app.use(cors())

app.get('/api', (_req, res) => {
    res.send('hello world')
})

app.use('/api/products', productRoutes)
app.use('/api/users', usersRoutes)

app.listen(port, () => {
    console.log(`API ready to use on port ${port}`);
})