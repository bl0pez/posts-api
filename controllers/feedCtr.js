const clearImage = require('../helpers/clearImage');
const Post = require('../models/post');
const User = require('../models/user');


const getPosts = async(req, res, next) => {
    try {
        
        const { currentPage = 1, perPage = 2 } = req.query;

        const [totalItems, posts] = await Promise.all([
            Post.find().countDocuments(),
            Post.find()
                .populate('creator', 'name')
                .skip((currentPage - 1) * perPage)
                .limit(perPage)
                .populate('creator', 'name')
        ]);

        res.status(200).json({
            message: 'Posts fetched',
            posts: posts,
            totalItems: totalItems
        })


    } catch (error) {
        error.statusCode = 500;
        throw error;
    }
}

const createPost = async (req, res, next) => {
    const { title, content } = req.body;

    try {

        if(!req.file){
            const error = new Error('No image provided');
            error.statusCode = 422;
            throw error;
        }

        const imageUrl = req.file.path;

        //Creamos el post en la base de datos
        const post = await Post.create({
            title,
            content,
            imageUrl,
            creator: req.userId
        });

        //Buscamos el usuario que ha creado el post
        const user = await User.findById(req.userId);

        //Añadimos el post al usuario
        user.posts.push(post);

        //Guardamos el usuario
        await user.save();

        res.status(201).json({
            message: 'Post created successfully!',
            post: post,
        })
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }


}

const getPost = async(req, res, next) => {
    try {
        
        const { postId } = req.params;

        const post = await Post.findById(postId);

        if(!post){
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: 'Post fetched',
            post: post
        })
        

    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }

}

const updatePost = async(req, res, next) => {
    try {
        
        const { postId } = req.params;
        const { title, content, imageUrl } = req.body;

        //Si hay una imagen, la guardamos
        if(req.file){
            imageUrl = req.file.path;
        }

        //Si no hay imagen, lanzamos un error
        if(!imageUrl){
            const error = new Error('No file picked');
            error.statusCode = 422;
            throw error;
        }

        //Buscamos el post en la base de datos
        const post = await Post.findById(postId);

        //Si la imagen es diferente a la que ya tenia, la borramos
        if(post.imageUrl !== imageUrl){
            clearImage(post.imageUrl);
        }

        //Si no encontramos el post, lanzamos un error
        if(!post){
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error;
        }

        //Actualizamos el post
        const updatedPost = await Post.findByIdAndUpdate(postId, {
            title,
            content,
            imageUrl
        }, {new: true});

        res.status(200).json({
            message: 'Post updated',
            post: updatedPost
        });


    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}

const deletePost = async(req, res, next) => {
    try {
        
        const { userId } = req;
        const { postId } = req.params;

        //Buscamos el post en la base de datos
        const post = await Post.findById(postId);

        //Si no encontramos el post, lanzamos un error
        if(!post){
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error;
        }

        //Si el usuario no es el creador del post, lanzamos un error
        if(post.creator.toString() !== userId){
            const error = new Error('Not authorized to delete this post');
            error.statusCode = 403;
            throw error;
        }

        //Borramos la imagen
        clearImage(post.imageUrl);

        //Borramos el post
        await Post.findByIdAndRemove(postId, {
            where: {
                _id: postId,
                creator: userId
            }
        });

        //Eliminamos el post del usuario
        const user = await User.findById(userId);
        user.posts.pull(postId);
        await user.save();

        res.status(200).json({
            message: 'Post deleted'
        })

    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}

module.exports = {
    getPosts,
    createPost,
    getPost,
    updatePost,
    deletePost
}