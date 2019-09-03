const express = require('express');
const router = express.Router();
router.use(express.json())
const Posts = require('../data/db.js')

router.get('/', (req, res) => {
    res.send('get SUCCESS');
});

//post
router.post('/posts', (req, res) => {
    const {title, contents} = req.body;
    if (!title || !contents) {
        res.status(400).json({ errorMessage: "You must provide a title and contents to retrieve a post" })

    } else {
        Posts.insert(req.body)
    .then(result => {
        res.status(201).json(result)
    })
    .catch(err => {
        res.status(500).json({ error: "error" })
    })
    }
    
});
//get
router.get('/posts', (req, res) => {
    Posts.find()
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({ error: "error" })
    })
    }
);
//get by id
router.get('/posts/:id', (req, res) => {
    const id = req.params.id
    Posts.findById(id)
    .then(post => {
        post == 0 ? res.status(404).json({ message: "The post you are looking for does not exist." })
        : res.status(200).json(post) 
    })
    .catch(err => {
        res.status(500).json({ error: "error" })
    })
})
// put by id
router.put('/posts/:id', (req, res) => {
    const id = req.params.id
    const {title, contents} = req.body;
    if (!title || !contents) {
        res.status(400).json({ errorMessage: "You must provide a title and contents to retrieve a post." })
    } else {
        Posts.update(id, req.body)
    .then(post => {
        post === 1 ?
        Posts.findById(id).then(u => res.status(201).json(u)) :
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    })
    .catch(err => {
        res.status(500).json({ error: "error." })
    })
    }

})
//delete by id
router.delete('/posts/:id', (req, res) => {
    const id = req.params.id
    Posts.remove(id)
    .then(user => {
        user ? res.status(200).json(user) : res.status(404).json({ message: "The post you are looking for does not exist." })
    })
    .catch(err => {
        res.status(500).json({ error: "error" })
    })
})
router.post('/posts/:id/comments', (req, res) => {
    const {text} = req.body;
    const newComment = {...req.body, "post_id": req.params.id }
    if (!text) {
        res.status(400).json({ errorMessage: "You must provide a comment." })
    } else {
        Posts.insertComment(newComment)
            .then(inserted => 
                {
                    Posts.findCommentById(inserted.id).then(fullComment => res.status(201).json((fullComment)))
                })
            .catch(err => res.status(500).json({ error: "error" }))
    }
})
router.get('/posts/:id/comments', (req, res) => {
    const id = req.params.id
    Posts.findPostComments(id)
    .then(comments => {
        comments == 0 ? res.status(404).json({ message: "The post you are looking for does not exist." })
        : res.status(200).json(comments) 
    })
    .catch(err => {
        res.status(500).json({ error: "error" })
    })
})

module.exports = router;