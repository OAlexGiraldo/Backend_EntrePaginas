// middleware/auth.js
import jwt from 'jsonwebtoken';
 
const verifyToken = (req, res, next) => {
 const authHeader = req.headers['authorization'];

 if (!authHeader) {
 return res.status(403).json({ error: 'Token requerido' });
 }

 const token = authHeader.split(' ')[1];

 if (!token) {
 return res.status(403).json({ error: 'Token requerido' });
 }

 try {
 const secretKey = process.env.JWT_SECRET || 'secret_key'; // Usar variable de entorno
 const decoded = jwt.verify(token, secretKey);
 req.userId = decoded.id;
 next();
 } catch (err) {
 console.error('Error verificando el token:', err);
 return res.status(401).json({ error: 'Token inválido', message: err.message }); // Incluir mensaje de error
 }
};

export { verifyToken };
