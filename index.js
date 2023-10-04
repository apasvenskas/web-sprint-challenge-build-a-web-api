// implement your API here
const express = require('express');

const server = express();

server.use(express.json());

const {find, findById, insert, update, remove} = require('./data/db')

server.get('/', (req, res) => {
    res.send('Hello World!');
});

server.get('/hobbits', (req, res) => {
    const hobbits = [
        {
            id: 1,
            name: 'Samwise Gamgee'
        },
        {
            id: 2,
            name: 'Frodo Baggins'
        },
    ];
    res.status(200).json(hobbits);
})

server.post('/api/users', async (req, res) => {
    const user = req.body;
    if(!user.name || !user.bio){
        res.status(400).json({message: 'Please provide name and bio for the user.'})
    } else {
      try {
        const newUser = await insert(user);
        res.status(201).json(newUser)
      } catch (error){
        res.status(500).json({message: 'There was an error while saving the user to the database'})
      }
    }
});

server.get('/api/users/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const foundUser = await findById(id);
        if(foundUser){
            res.status(200).json(foundUser);
        } else {
            res.status(404).json({message: 'The user with the specified ID does not exist.'})
        }
    } catch (error){
        res.status(500).json({message: 'The user information could not be retrieved'})
    }
})

server.delete('/api/users/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const deletedUser = await remove(id);
        if(deletedUser){
            res.status(200).json(deletedUser);
        } else {
            res.status(404).json({message: 'The user with specified ID does not exist.'})
        }
    } catch (error){
        res.status(500).json({message: 'The user could not be removed'})
    }
})

server.put('/api/users/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const updatedUser = req.body;
    if(!updatedUser.name || !updatedUser.bio){ 
        res.status(400).json({message: 'Please provide name and bio for the user.'})
    } else {
        try {
            const updateCount = await update(id, updatedUser);
            if(updateCount){
                res.status(200).json(updateCount);
            } else {
                res.status(404).json({message: 'The user with the specified ID does not exist'})
            }
        } catch (error){
            res.status(500).json({message: 'The user information could not be modified.'})
        }
    }
});

server.listen(8000, () => console.log('API running on port 8000'));
