const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// DEBUG - Ver qué está pasando con las variables
console.log('🔍 ===== VARIABLES DE ENTORNO =====');
console.log('🔍 PORT:', PORT);
console.log('🔍 NODE_ENV:', process.env.NODE_ENV || 'undefined');
console.log('🔍 DATABASE_URL existe:', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
    console.log('✅ DATABASE_URL conectada correctamente');
    console.log('🔍 DATABASE_URL empieza con:', process.env.DATABASE_URL.substring(0, 40) + '...');
} else {
    console.log('⚠️ ¡IMPORTANTE! DATABASE_URL no está configurada en Railway');
    console.log('⚠️ Por favor, agrega DATABASE_URL en Railway → CEAI-WEB → Variables');
}
console.log('🔍 ===== FIN VARIABLES =====\n');

// 🔧 CORRECCIÓN: Crear carpeta uploads DENTRO de backend
const uploadsDir = path.join(__dirname, 'uploads'); // SIN ../
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Carpeta uploads creada en:', uploadsDir);
}

// Configurar multer para carga de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const sanitizedName = file.originalname.replace(/\s+/g, '_');
        cb(null, `${timestamp}_${sanitizedName}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos PDF'), false);
        }
    }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../')));
// 🔧 CORRECCIÓN: Servir uploads correctamente
app.use('/uploads', express.static(uploadsDir));

// Conectar a PostgreSQL
const poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

console.log('🔍 Pool Config:', { 
    hasConnectionString: !!poolConfig.connectionString,
    ssl: poolConfig.ssl ? 'enabled' : 'disabled',
    max: poolConfig.max
});

const pool = new Pool(poolConfig);

// Manejo de errores del pool
pool.on('error', (err) => {
    console.error('❌ Error en pool de conexiones:', err);
});

// Probar conexión
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error conectando a PostgreSQL:', err.message);
        console.error('❌ Error code:', err.code);
    } else {
        console.log('✅ Base de datos PostgreSQL conectada correctamente');
        release();
    }
});

// Crear tablas
const createTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS noticias (
                id SERIAL PRIMARY KEY,
                titulo TEXT NOT NULL,
                descripcion TEXT NOT NULL,
                fecha TEXT NOT NULL,
                imagen TEXT,
                tipo TEXT DEFAULT 'Noticia',
                destacada INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS semilleros (
                id SERIAL PRIMARY KEY,
                nombre TEXT NOT NULL,
                linea TEXT NOT NULL,
                enfoque TEXT NOT NULL,
                descripcion TEXT NOT NULL,
                imagen TEXT,
                categoria TEXT DEFAULT 'Soluciones Digitales',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 🆕 Agregar columna categoría si no existe
        await pool.query(`
            ALTER TABLE semilleros 
            ADD COLUMN IF NOT EXISTS categoria TEXT DEFAULT 'Soluciones Digitales'
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS proyectos (
                id SERIAL PRIMARY KEY,
                semillero_id INTEGER NOT NULL,
                titulo TEXT NOT NULL,
                estado TEXT NOT NULL,
                aliados TEXT,
                objetivo TEXT,
                entregables TEXT,
                evidencia TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (semillero_id) REFERENCES semilleros(id)
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS documentos (
                id SERIAL PRIMARY KEY,
                nombre TEXT NOT NULL,
                tipo TEXT NOT NULL,
                descripcion TEXT,
                ruta_archivo TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS contactos (
                id SERIAL PRIMARY KEY,
                nombre TEXT NOT NULL,
                email TEXT NOT NULL,
                asunto TEXT NOT NULL,
                mensaje TEXT NOT NULL,
                leido INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('📊 Tablas creadas correctamente');
    } catch (err) {
        console.error('❌ Error creando tablas:', err.message);
    }
};

createTables();

// ============ RUTAS NOTICIAS ============
app.get('/api/noticias', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM noticias ORDER BY fecha DESC');
        res.json(result.rows || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/noticias/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM noticias WHERE id = $1', [req.params.id]);
        res.json(result.rows[0] || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/noticias', async (req, res) => {
    const { titulo, descripcion, fecha, imagen, tipo, destacada } = req.body;

    if (!titulo || !descripcion || !fecha) {
        return res.status(400).json({ error: 'Título, descripción y fecha son obligatorios' });
    }

    const tipoValue = tipo || 'Noticia';
    const destacadaValue = destacada ? 1 : 0;

    try {
        const result = await pool.query(
            'INSERT INTO noticias (titulo, descripcion, fecha, imagen, tipo, destacada) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [titulo, descripcion, fecha, imagen, tipoValue, destacadaValue]
        );
        res.json({ id: result.rows[0].id, message: 'Noticia creada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/noticias/:id', async (req, res) => {
    const { titulo, descripcion, fecha, imagen, tipo, destacada } = req.body;
    const tipoValue = tipo || 'Noticia';
    const destacadaValue = destacada ? 1 : 0;

    try {
        await pool.query(
            'UPDATE noticias SET titulo=$1, descripcion=$2, fecha=$3, imagen=$4, tipo=$5, destacada=$6 WHERE id=$7',
            [titulo, descripcion, fecha, imagen, tipoValue, destacadaValue, req.params.id]
        );
        res.json({ message: 'Noticia actualizada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/noticias/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM noticias WHERE id=$1', [req.params.id]);
        res.json({ message: 'Noticia eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ RUTAS SEMILLEROS ============
// 🔥 IMPORTANTE: Rutas específicas PRIMERO, rutas con parámetros DESPUÉS

// 🆕 Obtener semilleros por categoría (DEBE IR PRIMERO)
app.get('/api/semilleros/categoria/:categoria', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM semilleros WHERE categoria = $1 ORDER BY nombre',
            [req.params.categoria]
        );
        res.json(result.rows || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener todos los semilleros
app.get('/api/semilleros', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM semilleros ORDER BY categoria, nombre');
        res.json(result.rows || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener semillero por ID (DEBE IR DESPUÉS de /categoria)
app.get('/api/semilleros/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM semilleros WHERE id = $1', [req.params.id]);
        res.json(result.rows[0] || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔧 Crear semillero con categoría
app.post('/api/semilleros', async (req, res) => {
    const { nombre, linea, enfoque, descripcion, imagen, categoria } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO semilleros (nombre, linea, enfoque, descripcion, imagen, categoria) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [nombre, linea, enfoque, descripcion, imagen, categoria || 'Soluciones Digitales']
        );
        res.json({ id: result.rows[0].id, message: 'Semillero creado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔧 Actualizar semillero con categoría
app.put('/api/semilleros/:id', async (req, res) => {
    const { nombre, linea, enfoque, descripcion, imagen, categoria } = req.body;
    try {
        await pool.query(
            'UPDATE semilleros SET nombre=$1, linea=$2, enfoque=$3, descripcion=$4, imagen=$5, categoria=$6 WHERE id=$7',
            [nombre, linea, enfoque, descripcion, imagen, categoria, req.params.id]
        );
        res.json({ message: 'Semillero actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/semilleros/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM semilleros WHERE id=$1', [req.params.id]);
        res.json({ message: 'Semillero eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ RUTAS PROYECTOS ============
app.get('/api/proyectos/semillero/:semillero_id', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM proyectos WHERE semillero_id = $1 ORDER BY id DESC',
            [req.params.semillero_id]
        );
        res.json(result.rows || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/proyectos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM proyectos ORDER BY id DESC');
        res.json(result.rows || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/proyectos/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM proyectos WHERE id = $1', [req.params.id]);
        res.json(result.rows[0] || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/proyectos', async (req, res) => {
    const { semillero_id, titulo, estado, aliados, objetivo, entregables, evidencia } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO proyectos (semillero_id, titulo, estado, aliados, objetivo, entregables, evidencia) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            [semillero_id, titulo, estado, aliados, objetivo, entregables, evidencia]
        );
        res.json({ id: result.rows[0].id, message: 'Proyecto creado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/proyectos/:id', async (req, res) => {
    const { semillero_id, titulo, estado, aliados, objetivo, entregables, evidencia } = req.body;
    try {
        await pool.query(
            'UPDATE proyectos SET semillero_id=$1, titulo=$2, estado=$3, aliados=$4, objetivo=$5, entregables=$6, evidencia=$7 WHERE id=$8',
            [semillero_id, titulo, estado, aliados, objetivo, entregables, evidencia, req.params.id]
        );
        res.json({ message: 'Proyecto actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/proyectos/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM proyectos WHERE id=$1', [req.params.id]);
        res.json({ message: 'Proyecto eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ RUTAS DOCUMENTOS ============
app.get('/api/documentos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM documentos ORDER BY created_at DESC');
        res.json(result.rows || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/documentos', upload.single('archivo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const { nombre, tipo, descripcion } = req.body;
    const rutaArchivo = `/uploads/${req.file.filename}`;

    try {
        const result = await pool.query(
            'INSERT INTO documentos (nombre, tipo, descripcion, ruta_archivo) VALUES ($1, $2, $3, $4) RETURNING id',
            [nombre, tipo, descripcion, rutaArchivo]
        );
        res.json({ id: result.rows[0].id, message: 'Documento creado', ruta: rutaArchivo });
    } catch (err) {
        fs.unlink(req.file.path, () => {});
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/documentos/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT ruta_archivo FROM documentos WHERE id=$1', [req.params.id]);
        const row = result.rows[0];

        await pool.query('DELETE FROM documentos WHERE id=$1', [req.params.id]);

        if (row && row.ruta_archivo) {
            const filePath = path.join(__dirname, '..', row.ruta_archivo);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error eliminando archivo:', err);
            });
        }
        res.json({ message: 'Documento eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ RUTAS CONTACTOS ============
app.get('/api/contactos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM contactos ORDER BY created_at DESC');
        res.json(result.rows || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/contactos', async (req, res) => {
    const { nombre, email, asunto, mensaje } = req.body;
    if (!nombre || !email || !asunto || !mensaje) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO contactos (nombre, email, asunto, mensaje) VALUES ($1, $2, $3, $4) RETURNING id',
            [nombre, email, asunto, mensaje]
        );
        res.json({ id: result.rows[0].id, message: 'Mensaje guardado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/contactos/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM contactos WHERE id=$1', [req.params.id]);
        res.json({ message: 'Mensaje eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        mensaje: 'API CEAI funcionando con PostgreSQL',
        endpoints: {
            noticias: '/api/noticias',
            semilleros: '/api/semilleros',
            'semilleros_por_categoria': '/api/semilleros/categoria/:categoria',
            proyectos: '/api/proyectos',
            documentos: '/api/documentos',
            contactos: '/api/contactos'
        }
    });
});

// Manejo de errores en multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'Archivo muy grande (máximo 50MB)' });
        }
    }
    if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log('🚀 ===== SERVIDOR LISTO =====');
});