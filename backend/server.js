const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Crear carpeta de uploads si no existe
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
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
app.use('/uploads', express.static(uploadsDir));

// Conectar a SQLite
const db = new sqlite3.Database('./ceai_db.sqlite', (err) => {
    if (err) console.error('Error abriendo BD:', err);
    else console.log('✅ Base de datos SQLite conectada');
});

// Crear tablas
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS noticias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            descripcion TEXT NOT NULL,
            fecha TEXT NOT NULL,
            imagen TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS semilleros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            linea TEXT NOT NULL,
            enfoque TEXT NOT NULL,
            descripcion TEXT NOT NULL,
            imagen TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS proyectos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            semillero_id INTEGER NOT NULL,
            titulo TEXT NOT NULL,
            estado TEXT NOT NULL,
            aliados TEXT,
            objetivo TEXT,
            entregables TEXT,
            evidencia TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (semillero_id) REFERENCES semilleros(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS documentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            tipo TEXT NOT NULL,
            descripcion TEXT,
            ruta_archivo TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS contactos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT NOT NULL,
            asunto TEXT NOT NULL,
            mensaje TEXT NOT NULL,
            leido INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('📊 Tablas creadas correctamente');
});

// ============ RUTAS NOTICIAS ============
app.get('/api/noticias', (req, res) => {
    db.all('SELECT * FROM noticias ORDER BY fecha DESC', (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows || []);
    });
});

app.get('/api/noticias/:id', (req, res) => {
    db.get('SELECT * FROM noticias WHERE id = ?', [req.params.id], (err, row) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(row);
    });
});

app.post('/api/noticias', (req, res) => {
    const { titulo, descripcion, fecha, imagen } = req.body;
    db.run(
        'INSERT INTO noticias (titulo, descripcion, fecha, imagen) VALUES (?, ?, ?, ?)',
        [titulo, descripcion, fecha, imagen],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID, message: 'Noticia creada' });
        }
    );
});

app.put('/api/noticias/:id', (req, res) => {
    const { titulo, descripcion, fecha, imagen } = req.body;
    db.run(
        'UPDATE noticias SET titulo=?, descripcion=?, fecha=?, imagen=? WHERE id=?',
        [titulo, descripcion, fecha, imagen, req.params.id],
        (err) => {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ message: 'Noticia actualizada' });
        }
    );
});

app.delete('/api/noticias/:id', (req, res) => {
    db.run('DELETE FROM noticias WHERE id=?', [req.params.id], (err) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ message: 'Noticia eliminada' });
    });
});

// ============ RUTAS SEMILLEROS ============
app.get('/api/semilleros', (req, res) => {
    db.all('SELECT * FROM semilleros', (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows || []);
    });
});

app.post('/api/semilleros', (req, res) => {
    const { nombre, linea, enfoque, descripcion, imagen } = req.body;
    db.run(
        'INSERT INTO semilleros (nombre, linea, enfoque, descripcion, imagen) VALUES (?, ?, ?, ?, ?)',
        [nombre, linea, enfoque, descripcion, imagen],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID, message: 'Semillero creado' });
        }
    );
});

app.put('/api/semilleros/:id', (req, res) => {
    const { nombre, linea, enfoque, descripcion, imagen } = req.body;
    db.run(
        'UPDATE semilleros SET nombre=?, linea=?, enfoque=?, descripcion=?, imagen=? WHERE id=?',
        [nombre, linea, enfoque, descripcion, imagen, req.params.id],
        (err) => {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ message: 'Semillero actualizado' });
        }
    );
});

app.delete('/api/semilleros/:id', (req, res) => {
    db.run('DELETE FROM semilleros WHERE id=?', [req.params.id], (err) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ message: 'Semillero eliminado' });
    });
});

// ============ RUTAS PROYECTOS ============
app.get('/api/proyectos/semillero/:semillero_id', (req, res) => {
    db.all(
        'SELECT * FROM proyectos WHERE semillero_id = ? ORDER BY id DESC',
        [req.params.semillero_id],
        (err, rows) => {
            if (err) res.status(500).json({ error: err.message });
            else res.json(rows || []);
        }
    );
});

app.get('/api/proyectos', (req, res) => {
    db.all('SELECT * FROM proyectos ORDER BY id DESC', (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows || []);
    });
});

app.post('/api/proyectos', (req, res) => {
    const { semillero_id, titulo, estado, aliados, objetivo, entregables, evidencia } = req.body;
    db.run(
        'INSERT INTO proyectos (semillero_id, titulo, estado, aliados, objetivo, entregables, evidencia) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [semillero_id, titulo, estado, aliados, objetivo, entregables, evidencia],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID, message: 'Proyecto creado' });
        }
    );
});

app.put('/api/proyectos/:id', (req, res) => {
    const { semillero_id, titulo, estado, aliados, objetivo, entregables, evidencia } = req.body;
    db.run(
        'UPDATE proyectos SET semillero_id=?, titulo=?, estado=?, aliados=?, objetivo=?, entregables=?, evidencia=? WHERE id=?',
        [semillero_id, titulo, estado, aliados, objetivo, entregables, evidencia, req.params.id],
        (err) => {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ message: 'Proyecto actualizado' });
        }
    );
});

app.delete('/api/proyectos/:id', (req, res) => {
    db.run('DELETE FROM proyectos WHERE id=?', [req.params.id], (err) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ message: 'Proyecto eliminado' });
    });
});

// ============ RUTAS DOCUMENTOS ============
app.get('/api/documentos', (req, res) => {
    db.all('SELECT * FROM documentos ORDER BY created_at DESC', (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows || []);
    });
});

app.post('/api/documentos', upload.single('archivo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const { nombre, tipo, descripcion } = req.body;
    const rutaArchivo = `/uploads/${req.file.filename}`;

    db.run(
        'INSERT INTO documentos (nombre, tipo, descripcion, ruta_archivo) VALUES (?, ?, ?, ?)',
        [nombre, tipo, descripcion, rutaArchivo],
        function (err) {
            if (err) {
                fs.unlink(req.file.path, () => {});
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: this.lastID, message: 'Documento creado', ruta: rutaArchivo });
            }
        }
    );
});

app.delete('/api/documentos/:id', (req, res) => {
    db.get('SELECT ruta_archivo FROM documentos WHERE id=?', [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        db.run('DELETE FROM documentos WHERE id=?', [req.params.id], (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                if (row && row.ruta_archivo) {
                    const filePath = path.join(__dirname, '..', row.ruta_archivo);
                    fs.unlink(filePath, (err) => {
                        if (err) console.error('Error eliminando archivo:', err);
                    });
                }
                res.json({ message: 'Documento eliminado' });
            }
        });
    });
});

// ============ RUTAS CONTACTOS ============
app.get('/api/contactos', (req, res) => {
    db.all('SELECT * FROM contactos ORDER BY created_at DESC', (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows || []);
    });
});

app.post('/api/contactos', (req, res) => {
    const { nombre, email, asunto, mensaje } = req.body;
    
    if (!nombre || !email || !asunto || !mensaje) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    db.run(
        'INSERT INTO contactos (nombre, email, asunto, mensaje) VALUES (?, ?, ?, ?)',
        [nombre, email, asunto, mensaje],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID, message: 'Mensaje guardado correctamente' });
        }
    );
});

app.delete('/api/contactos/:id', (req, res) => {
    db.run('DELETE FROM contactos WHERE id=?', [req.params.id], (err) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ message: 'Mensaje eliminado' });
    });
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        mensaje: 'API CEAI funcionando',
        endpoints: {
            noticias: '/api/noticias',
            semilleros: '/api/semilleros',
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
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
