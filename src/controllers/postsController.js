const sql = require('mssql');
const dbConfig = require('../database/database'); // Asegúrate de que la ruta es correcta

async function getAllPosts(req, res) {
    try {
        await sql.connect(dbConfig);

        const result = await new sql.Request().query('SELECT id, titulo, contenido, autor_id, created_at, updated_at FROM Posts');

        res.json(result.recordset); // Corrige el error de tipografía en res,json
    } catch (err) {
        console.error('Error al obtener los Posts:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        sql.close();
    }
}

async function getPostById(req, res){
    const postId = req.params.id;

    try{
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('id', sql.Int, postId);

        const result = await request.query('SELECT id, titulo, contenido, created_at, updated_at FROM Posts WHERE id = @id');

        if(result.recordset.length === 0){
            return res.status(404).json({ message: 'Post no encontrado' });
        }

        res.json(result.recordset[0]);
    } catch(err){
        console.error('Error al obtener el post:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        sql.close();
    }
}

async function createPost(req, res) {
    const { titulo, contenido, autor_id } = req.body;

    try {
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('titulo', sql.NVarChar, titulo);
        request.input('contenido', sql.NVarChar, contenido);
        request.input('autor_id', sql.Int, autor_id);

        const result = await request.query(`
            INSERT INTO Posts (titulo, contenido, autor_id, created_at, updated_at)
            VALUES (@titulo, @contenido, @autor_id, GETDATE(), GETDATE());
            SELECT SCOPE_IDENTITY() AS id;
        `);

        res.status(201).json({ id: result.recordset[0].id });
    } catch (err) {
        console.error('Error al crear el post:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        sql.close();
    }
}

async function updatePost(req, res) {
    const postId = req.params.id;
    const { titulo, contenido } = req.body;

    try {
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('id', sql.Int, postId);
        request.input('titulo', sql.NVarChar, titulo);
        request.input('contenido', sql.NVarChar, contenido);

        const result = await request.query(`
            UPDATE Posts
            SET titulo = @titulo, contenido = @contenido, updated_at = GETDATE()
            WHERE id = @id
        `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }

        res.json({ message: 'Post actualizado exitosamente' });
    } catch (err) {
        console.error('Error al actualizar el post:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        sql.close();
    }
}

async function deletePost(req, res) {
    const postId = req.params.id;

    try {
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('id', sql.Int, postId);

        const result = await request.query(`
            DELETE FROM Posts
            WHERE id = @id
        `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }

        res.json({ message: 'Post eliminado exitosamente' });
    } catch (err) {
        console.error('Error al eliminar el post:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        sql.close();
    }
}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};
