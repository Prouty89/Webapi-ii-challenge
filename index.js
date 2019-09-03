const express = require('express');

const postsRouter = require('./api/postsRouter')

const server = express();

server.use('/api', postsRouter);

server.get('/', (req, res) => {
    res.send('Server Success')
});

server.listen(8000, () => console.log('API running on port 8000'));