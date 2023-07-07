const { Router } = require('express');
const { body } = require('express-validator');
const { getPosts, createPost, getPost, updatePost, deletePost } = require('../controllers/feedCtr');
const errorHandler = require('../middleware/errorHandler');
const isAuth = require('../middleware/isAuth');
const router = Router();

//Obtener todos los posts
router.get('/posts', getPosts);

router.get('/posts/:postId', getPost);

router.use(isAuth);

//Crear un post
router.post('/post',[
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5}),
    errorHandler
],createPost);


router.put('/post/:postId',[
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5}),
    errorHandler
],updatePost);

router.delete('/post/:postId', deletePost);

module.exports = router;

