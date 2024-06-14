// importaciones como los import ... from ...
const express = require('express');
const router = express.Router();

// llamar controlador de users
const userController = require('../controllers/userController');
const postsController = require('../controllers/postsController');
const commentController = require('../controllers/commentController');
const { route } = require('../app');
const { authenticateToken } = require('../middlewares/authenticateToken');

// ---------------rutas Users-----------------------
// Traer todos los usuarios
router.get('/users', userController.getAllUsers);
//  Traer Usuario en especifico
router.get('/users/:id', userController.getUserById);
// Registro de usuario
router.post('/register',authenticateToken, userController.register);
// login de usuario
router.post('/login',authenticateToken, userController.login);
// actualizar un usuario en especifico
router.put('/update/users/:id', userController.UserUpdate);
// eliminar un usuario en especifico
router.delete('/delete/users/:id', userController.DeleteUser);

// ----------------rutas posts------------------------
// traer todos los posts
router.get('/posts', postsController.getAllPosts);
// traer post especifico
router.get('/posts/:id', postsController.getPostById);
// crear un post
router.post('/posts/create', postsController.createPost);
// actualizar un post en especifico
router.put('/posts/update/:id', postsController.updatePost);
// eliminar un post en especifico
router.delete('/posts/delete/:id', postsController.deletePost);

// --------------rutas comentarios--------------------
// traer todos los comentarios existentes
router.get('/comments', commentController.getAllComment);
// traer un comnetario en especifico
router.get('/comments/:id', commentController.getCommentById);
// traer comentarios de un post en especifico
router.get('/posts/:postId/comments', commentController.getCommentsByPostId);
// crear o hacer un comentario
router.post('/comments/create', commentController.createComment);
// Editar cometario
router.put('/comments/update/:id', commentController.updateComment);
// Eliminar comentario
router.delete('/comments/delete/:id', commentController.deleteComment);

// exportacion como react export default
module.exports = router;