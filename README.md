# CEAI - Página Web Institucional

**Centro de Excelencia en Automatización e Innovación**  
Regional Valle del SENA

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Acceso al Proyecto](#acceso-al-proyecto)
- [Solución de Problemas](#solución-de-problemas)

---

## 📖 Descripción

Plataforma web institucional completa para la divulgación, gestión y comunicación del CEAI SENA Regional Valle. Incluye:

- **Sitio público**: 10 páginas institucionales con contenido dinámico
- **Panel administrativo**: Gestor de noticias, semilleros y proyectos
- **Base de datos**: SQLite con 3 tablas relacionadas
- **API REST**: 10+ endpoints para gestión de contenido
- **Responsive design**: Compatible con todos los dispositivos

**Versión**: 1.0  
**Última actualización**: Enero 2026

---

## 🔧 Requisitos Previos

Antes de instalar, asegúrate de tener lo siguiente:

### Software Necesario

| Software | Versión | Descripción | Descargar |
|----------|---------|-------------|-----------|
| **Node.js** | 18.x o superior | Runtime de JavaScript | [nodejs.org](https://nodejs.org/) |
| **Git** | 2.x o superior | Control de versiones | [git-scm.com](https://git-scm.com/) |
| **VS Code** (opcional) | Última | Editor de código recomendado | [code.visualstudio.com](https://code.visualstudio.com/) |

### Verificar instalación

Abre terminal/CMD y ejecuta:

```bash
node --version      # Debe mostrar v18.x.x o superior
npm --version       # Debe mostrar 9.x.x o superior
git --version       # Debe mostrar 2.x.x o superior
```

---

## 📦 Instalación

### Paso 1: Clonar el repositorio

```bash
# Navega a la carpeta donde quieras el proyecto
cd ruta/donde/guardar/proyecto

# Clona el repositorio
git clone https://github.com/TU_USUARIO/CEAI-WEB.git

# Entra a la carpeta
cd CEAI-WEB
```

### Paso 2: Instalar dependencias del backend

```bash
# Navega a la carpeta backend
cd backend

# Instala las dependencias de Node.js
npm install

# Verifica que se instaló correctamente
npm list
```

**Dependencias instaladas:**

- `express` (v4.18+) - Framework web
- `sqlite3` (v5.1+) - Base de datos
- `cors` (v2.8+) - Manejo de CORS
- `body-parser` (v1.20+) - Parseo de JSON

### Paso 3: Estructura de carpetas

Verifica que tu proyecto tenga esta estructura:

```
CEAI-WEB/
├── index.html
├── innovacion.html
├── grupo-investigacion.html
├── semilleros.html
├── semillero-detalle.html
├── servicios.html
├── aliados.html
├── quienes-somos.html
├── contacto.html
├── admin.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   └── datos.js
├── docs/
│   ├── portafolio-servicios-ceai.pdf
│   └── convocatoria-proyectos-2026.pdf
├── README.md
├── DOCUMENTACION.md
└── backend/
    ├── package.json
    ├── node_modules/
    ├── server.js
    └── ceai_db.sqlite (se crea automáticamente)
```

---

## 🚀 Ejecución

### Opción A: Ejecución Local (Desarrollo)

#### Terminal 1 - Iniciar backend

```bash
cd backend
node server.js
```

**Salida esperada:**
```
✅ Base de datos SQLite conectada
📊 Tablas creadas correctamente
🚀 Servidor corriendo en http://localhost:5000
```

#### Terminal 2 - Abrir el sitio público

Opción 1: Abre `index.html` directamente en tu navegador
```
Ruta: C:\ruta\a\CEAI-WEB\index.html
```

Opción 2: Usa un servidor local (recomendado)
```bash
# Si tienes Python instalado
python -m http.server 8000

# O si usas Node.js
npx http-server
```

Luego abre en tu navegador:
```
http://localhost:8000/
```

#### Acceso al Panel Administrativo

Una vez que el backend está ejecutándose en terminal 1, abre en tu navegador:

```
http://localhost:5000/admin.html
```

**Usuario**: No hay autenticación en v1 (desarrollo)  
**Funcionalidades**:
- 📊 Dashboard con estadísticas
- 📰 Gestionar noticias
- 🌱 Gestionar semilleros
- 🔬 Gestionar proyectos

---

### Opción B: Despliegue en GitHub Pages (Demo Pública)

Para que el sitio sea accesible en línea sin tener que ejecutar backend localmente:

#### 1. Configurar GitHub Pages

```bash
# Desde la carpeta raíz del proyecto
git add .
git commit -m "Versión lista para despliegue"
git push origin main
```

#### 2. Activar en GitHub

1. Ve a tu repositorio en github.com
2. Abre **Settings** → **Pages**
3. Selecciona:
   - Branch: `main`
   - Folder: `/root`
4. Guarda

#### 3. Acceder al sitio en línea

Tu sitio estará disponible en:
```
https://TU_USUARIO.github.io/CEAI-WEB/
```

**Nota**: En despliegue público, el panel admin no funcionará completamente sin backend en la nube (requiere configuración adicional con Heroku, Railway, Vercel, etc.)

---

## 📁 Estructura del Proyecto

### Frontend (Público)

| Archivo | Descripción |
|---------|-------------|
| `index.html` | Home con noticias y semilleros destacados |
| `innovacion.html` | Información del área de innovación |
| `grupo-investigacion.html` | Estructura y composición del grupo |
| `semilleros.html` | Listado completo de semilleros |
| `semillero-detalle.html` | Proyectos de un semillero específico |
| `servicios.html` | Servicios tecnológicos + descargas PDF |
| `aliados.html` | Alianzas estratégicas y convenios |
| `quienes-somos.html` | Historia, misión y valores |
| `contacto.html` | Formulario de contacto |
| `admin.html` | Panel administrativo (v1) |

### Backend

| Archivo | Descripción |
|---------|-------------|
| `server.js` | Servidor Express + API REST |
| `package.json` | Dependencias de Node.js |
| `ceai_db.sqlite` | Base de datos SQLite (se crea automáticamente) |

### Assets

| Carpeta | Contenido |
|---------|-----------|
| `css/` | Estilos CSS personalizados |
| `js/` | Scripts de JavaScript (datos y funciones) |
| `docs/` | PDFs descargables |

---

## 📡 API REST - Endpoints

### Noticias

```
GET    /api/noticias              # Obtener todas las noticias
GET    /api/noticias/:id          # Obtener noticia por ID
POST   /api/noticias              # Crear noticia
PUT    /api/noticias/:id          # Actualizar noticia
DELETE /api/noticias/:id          # Eliminar noticia
```

### Semilleros

```
GET    /api/semilleros            # Obtener todos los semilleros
POST   /api/semilleros            # Crear semillero
PUT    /api/semilleros/:id        # Actualizar semillero
DELETE /api/semilleros/:id        # Eliminar semillero
```

### Proyectos

```
GET    /api/proyectos             # Obtener todos los proyectos
GET    /api/proyectos/semillero/:id  # Proyectos por semillero
POST   /api/proyectos             # Crear proyecto
PUT    /api/proyectos/:id         # Actualizar proyecto
DELETE /api/proyectos/:id         # Eliminar proyecto
```

---

## 🌐 Acceso al Proyecto

### Durante Desarrollo

| Componente | URL | Puerto |
|-----------|-----|--------|
| Sitio Público | `http://localhost:8000/` | 8000 |
| Backend API | `http://localhost:5000/` | 5000 |
| Panel Admin | `http://localhost:5000/admin.html` | 5000 |

### En Producción

| Componente | URL |
|-----------|-----|
| Sitio Público | `https://usuario.github.io/CEAI-WEB/` |
| Backend API | Requiere despliegue en servidor externo |
| Panel Admin | Requiere despliegue de backend |

---

## 🔧 Solución de Problemas

### Error: "npm: command not found"

**Solución**: Reinstala Node.js desde https://nodejs.org/ y reinicia la terminal

### Error: "Puerto 5000 ya está en uso"

```bash
# Para cambiar el puerto, edita backend/server.js y cambia:
const PORT = 5000;  # Cambiar a 5001, 5002, etc.

# Luego reinicia el servidor
node server.js
```

### Error: "CORS policy" en consola del navegador

Asegúrate que el backend está corriendo en terminal 1:
```bash
cd backend
node server.js
```

### Las noticias/semilleros no cargan

1. Verifica que el backend esté en `http://localhost:5000`
2. Abre el navegador → F12 → Pestaña "Console" para ver errores
3. Asegúrate que `js/main.js` tiene la URL correcta de API

### Base de datos vacía

Esto es normal en la primera ejecución. Agrega datos desde el panel admin:
```
http://localhost:5000/admin.html
```

---

## 📚 Documentación Adicional

Para información técnica detallada, arquitectura de base de datos, y guía de desarrollo, consulta:

**[DOCUMENTACION.md](./DOCUMENTACION.md)**

---

## 👨‍💻 Autor

**Desarrollado por**: Geovany Sacri  
**Instituto**: SENA Regional Valle  
**Año**: 2026

---

## 📄 Licencia

Este proyecto es de uso institucional del SENA.

---

## 📞 Soporte

Para reportar problemas o sugerencias:
1. Revisa la sección "Solución de Problemas"
2. Consulta la [Documentación Técnica](./DOCUMENTACION.md)
3. Crea un issue en GitHub

---

**Última actualización**: Enero 2026  
**Versión actual**: 1.0
