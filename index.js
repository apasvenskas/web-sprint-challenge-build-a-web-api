// implement your API here
const express = require('express');

const server = express();

server.use(express.json());

const users = [
    {
        id: 1,
        name: 'Alice',
        bio: 'An andevtures girl'
    },
    {
        id: 2,
        name: 'Bob',
        bio: 'An adventures boy'
    }
]

const generateId = () => {
    return users.length ? Math.max(...users.map(user => user.id)) + 1 : 0;
}

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

server.post('/api/users', (req, res) => {
    const user = req.body;
    if(!user.name || !user.bio){
        res.status(400).json({message: 'Please provide name and bio for the user.'})
    } else {
        user.id = generateId();
        users.push(user);
        res.status(201).json(user);
    }
});

server.get('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
    if (user){
        res.status(200).json(user);
    } else {
        res.status(404).json({message: 'The user with the specified ID does not exist.'})
    }
})

server.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(user => user.id === id);
    if (index !== -1){
        const deletedUser = users.splice(index, 1)[0];
        res.status(200).json(deletedUser);
    } else {
        res.status(404).json({message: 'The user with specified ID does not exist.'})
    }
})

server.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedUser = req.body;
    if(!updatedUser.name || !updatedUser.bio){ 
        res.status(400).json({message: 'Please provide name and bio for the user.'})
    } else {
        const index = users.findIndex(user => user.id === id);
        if(index !== -1){
            users[index] = {...updatedUser, id};
            res.status(200).json(users[index]);
        } else {
            res.status(404).json({message: 'The user with the specified ID does not exist'});
        }
    }
});

server.listen(8000, () => console.log('API running on port 8000'));
