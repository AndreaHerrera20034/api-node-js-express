const sql = require('mssql');
const dbConfig= require('../database/database'); // Importa la configuración de la base de datos
const bcrypt = require('bcrypt');

// Método para obtener todos los usuarios
async function getAllUsers(req, res){
  try{
    // conectarse a la base de datos
    await sql.connect(dbConfig);

    // Consulta SQL para obtener usuarios
    const result = await new sql.Request().query('SELECT id, username, email, created_at FROM Usuarios');

    //Enviar los usuarios como respuesta
    res.json(result.recordset);
  } catch(err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ message: 'Internal Server Error'});
  } finally {
    sql.close();
  }
}

async function getUserById(req, res) {
  const userId = req.params.id;

  try{
    // conexión
    await sql.connect(dbConfig);
    // crear solicitud prevenir SQLi
    const request =  new sql.Request();
    request.input('id', sql.Int, userId);

    // consulta
    const result = await request.query('SELECT id, username, email, created_at FROM Usuarios WHERE id = @id');

    // verificar si encuentra el usuario
    if (result.recordset.length === 0){
      return res.status(404).json({ message: 'Usuario no encontrado'});
    }

    // Enviar el usuario como respuesta
    res.json(result.recordset[0]);
  } catch(err){
    console.error('Error al obtener el usuario:', err);
    res.status(500).json({ message: 'Internal Server Error'});
  } finally {
    sql.close();
  }
}

async function register(req, res) {
  const { username, email, password } = req.body;

  try {
      await sql.connect(dbConfig);

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insertar el nuevo usuario en la base de datos
      const request = new sql.Request();
      request.input('username', sql.NVarChar, username);
      request.input('email', sql.NVarChar, email);
      request.input('passwordH', sql.NVarChar, hashedPassword);

      await request.query('INSERT INTO Usuarios (username, email, passwordH) VALUES (@username, @email, @passwordH)');

      // Obtener el usuario recién creado para generar el token
      const result = await request.query('SELECT id, username FROM Usuarios WHERE email = @email');
      const user = result.recordset[0];

      // Generar el token
      const token = generateAccessToken({ username: user.username, id: user.id });
      res.status(201).json({ token });
  } catch (err) {
      console.error('Error al registrar el usuario:', err);
      res.status(500).json({ message: 'Internal Server Error' });
  } finally {
      sql.close();
  }
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token expira en 1 hora
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
      await sql.connect(dbConfig);
      const request = new sql.Request();
      request.input('email', sql.NVarChar, email);

      const result = await request.query('SELECT id, username, passwordH FROM Usuarios WHERE email = @email');
      
      if (result.recordset.length === 0) {
          return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      const user = result.recordset[0];
      
      // Comparar la contraseña
      const validPassword = await bcrypt.compare(password, user.passwordH);
      
      if (!validPassword) {
          return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      // Generar el token
      const token = generateAccessToken({ username: user.username, id: user.id });
      res.json({ token });
  } catch (err) {
      console.error('Error al iniciar sesión:', err);
      res.status(500).json({ message: 'Internal Server Error' });
  } finally {
      sql.close();
  }
}

async function UserUpdate(req, res){
  const userId = req.params.id;
  const { username, email, password } = req.body;

  try{
    await sql.connect(dbConfig);

    const request = new sql.Request();
    request.input('id', sql.Int, userId);

    // solo actualizar los campos que fueron proporcionados en la solicitud
    let updateFields = [];
    if(username){
      request.input('username', sql.NVarChar, username);
      updateFields.push('username = @username');
    }
    if(email){
      request.input('email', sql.NVarChar, email);
      updateFields.push('email=@email');
    }
    if(password){
      const hashedPassword = bcrypt.hashSync(password, 10);
      request.input('password', sql.NVarChar, hashedPassword);
      updateFields.push('passwordH=@password');
    }

    if(updateFields.length === 0){
      return res.status(400).json({ message: 'No se proporcionaron datos para actualizar'});
    }

    const updateQuery =`UPDATE Usuarios SET ${updateFields.join(',')} WHERE id = @id`;

    // Ejecutar la consulta
    await request.query(updateQuery);

    // Enviar una respuesta
    res.json({ message: 'Usuario actualizado exitosamente'});
  } catch(err){
    console.error('Error al actualizar usuario:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    sql.close();
  }
}

async function DeleteUser(req, res){
  const userId = req.params.id;
  try{
    await sql.connect(dbConfig);

    const request = new sql.Request();
    request.input('id', sql.Int, userId);

    // consulta para eliminar
    const result = await request.query('DELETE FROM Usuarios WHERE id = @id');

    // verificar
    if(result.rowsAffected[0] === 0){
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Enviar una respuesta
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch(err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    sql.close();
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  register,
  login,
  UserUpdate,
  DeleteUser
};