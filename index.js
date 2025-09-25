

// const express = require("express")
// const cors = require("cors")

// const app = express()
// const port = 3000

// const users = []

// app.use(express.json())
// app.use(cors())

// app.get('/api', (_req, res) => {
//     res.send('hello world')
// })

// app.get('/api/users', (_req, res) => {
//     res.status(200).json(users)
// })

// app.post('/api/register', (req, res) => {
//     const { username, password } = req.body;

//     if(!username || !password) {
//         return res.status(400).json({
//             status: 400,
//             message: "username atau password gak boleh kosong"
//         })
//     }

//     const newUser = {
//         id: users.length + 1,
//         username: username,
//         password: password
//     }

//     users.push(newUser)

//     res.status(201).json({
//         message: "User Registered Succesfully",
//         user: newUser
//     })
// })

// app.listen(port, () => {
//     console.log(`API ready to use on port ${port}`);
// })