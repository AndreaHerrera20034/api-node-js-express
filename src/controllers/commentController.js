const sql = require('mssql');
const dbConfig = require('../database/database');

async function getAllComment(req, res){
    try{
        await sql.connect(dbConfig);

        const result = await new sql.Request().query('SELECT id, contenido, autor_id, post_id, created_at FROM Comentarios');

        res.json(result.recordset);
    } catch(err){
        console.error('Error al obtener comentarios:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        sql.close();
    }
}

async function getCommentById(req, res){
    const commentId = req.params.id;

    try{
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('id', sql.Int, commentId);

        const result = await request.query('SELECT id, contenido, autor_id, post_id, created_at FROM Comentarios WHERE id = @id');

        if(result.recordset.length === 0){
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }

        res.json(result.recordset[0]);
    } catch(err) {
        console.error('Error al obtener el comentario:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        sql.close();
    }
}

async function getCommentsByPostId(req, res) {
    const postId = req.params.postId;

    try {
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('postId', sql.Int, postId);

        const result = await request.query('SELECT id, contenido, autor_id, post_id, created_at FROM Comentarios WHERE post_id = @postId');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No hay comentarios para este post' });
        }

        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener los comentarios del post:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        sql.close();
    }
}

async function createComment(req, res) {
    const { contenido, autor_id, post_id } = req.body;

    try {
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('contenido', sql.NVarChar, contenido);
        request.input('autor_id', sql.Int, autor_id);
        request.input('post_id', sql.Int, post_id);

        const result = await request.query(`
            INSERT INTO Comentarios (contenido, autor_id, post_id, created_at)
            VALUES (@contenido, @autor_id, @post_id, GETDATE());
            SELECT SCOPE_IDENTITY() AS id;
        `);

        res.status(201).json({ id: result.recordset[0].id });
    } catch (err) {
        console.error('Error al crear el comentario:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        sql.close();
    }
}

async function updateComment(req, res) {
    const commentId = req.params.id;
    const { contenido } = req.body;

    try {
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('id', sql.Int, commentId);
        request.input('contenido', sql.NVarChar, contenido);

        const result = await request.query(`
            UPDATE Comentarios
            SET contenido = @contenido, created_at = GETDATE()
            WHERE id = @id
        `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }

        res.json({ message: 'Comentario actualizado exitosamente' });
    } catch (err) {
        console.error('Error al actualizar el comentario:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        sql.close();
    }
}

async function deleteComment(req, res) {
    const commentId = req.params.id;

    try {
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('id', sql.Int, commentId);

        const result = await request.query(`
            DELETE FROM Comentarios
            WHERE id = @id
        `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }

        res.json({ message: 'Comentario eliminado exitosamente' });
    } catch (err) {
        console.error('Error al eliminar el comentario:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        sql.close();
    }
}

module.exports = {
    getAllComment,
    getCommentById,
    getCommentsByPostId,
    createComment,
    updateComment,
    deleteComment
}