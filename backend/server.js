const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../'))); // Sirve archivos estáticos del frontend

// Conectar a SQLite
const db = new sqlite3.Database('./ceai_db.sqlite', (err) => {
    if (err) console.error('Error abriendo BD:', err);
    else console.log('✅ Base de datos SQLite conectada');
});

// ============ CREAR TABLAS ============
db.serialize(() => {
    // Tabla: Noticias
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

    // Tabla: Semilleros
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

    // Tabla: Proyectos
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
            url TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);


    console.log('📊 Tablas creadas correctamente');
});

// ============ RUTAS API: NOTICIAS ============

// GET todas las noticias
app.get('/api/noticias', (req, res) => {
    db.all('SELECT * FROM noticias ORDER BY fecha DESC', (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

// GET noticia por ID
app.get('/api/noticias/:id', (req, res) => {
    db.get('SELECT * FROM noticias WHERE id = ?', [req.params.id], (err, row) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(row);
    });
});

// POST crear noticia
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

// PUT actualizar noticia
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

// DELETE noticia
app.delete('/api/noticias/:id', (req, res) => {
    db.run('DELETE FROM noticias WHERE id=?', [req.params.id], (err) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ message: 'Noticia eliminada' });
    });
});

// ============ RUTAS API: SEMILLEROS ============

// GET todos los semilleros
app.get('/api/semilleros', (req, res) => {
    db.all('SELECT * FROM semilleros', (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

// POST crear semillero
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

// PUT actualizar semillero
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

// DELETE semillero
app.delete('/api/semilleros/:id', (req, res) => {
    db.run('DELETE FROM semilleros WHERE id=?', [req.params.id], (err) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ message: 'Semillero eliminado' });
    });
});

// ============ RUTAS API: PROYECTOS ============

// GET proyectos por semillero
app.get('/api/proyectos/semillero/:semillero_id', (req, res) => {
    db.all(
        'SELECT * FROM proyectos WHERE semillero_id = ? ORDER BY id DESC',
        [req.params.semillero_id],
        (err, rows) => {
            if (err) res.status(500).json({ error: err.message });
            else res.json(rows);
        }
    );
});

// GET todos los proyectos
app.get('/api/proyectos', (req, res) => {
    db.all('SELECT * FROM proyectos ORDER BY id DESC', (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

// POST crear proyecto
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

// PUT actualizar proyecto
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

// DELETE proyecto
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

app.post('/api/documentos', (req, res) => {
    const { nombre, tipo, descripcion, url } = req.body;
    db.run(
        'INSERT INTO documentos (nombre, tipo, descripcion, url) VALUES (?, ?, ?, ?)',
        [nombre, tipo, descripcion, url],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID, message: 'Documento creado' });
        }
    );
});

app.delete('/api/documentos/:id', (req, res) => {
    db.run('DELETE FROM documentos WHERE id=?', [req.params.id], (err) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ message: 'Documento eliminado' });
    });
});


// ============ INICIAR SERVIDOR ============
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
