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
- [API REST](#api-rest)
- [Trabajar en otro PC](#trabajar-en-otro-pc)
- [Solución de Problemas](#solución-de-problemas)
- [Autor](#autor)
- [Licencia](#licencia)
- [Soporte](#soporte)

---

## 📖 Descripción

Plataforma web institucional para la divulgación, gestión y comunicación del CEAI SENA Regional Valle. Incluye sitio público, panel administrativo, base de datos SQLite y API REST para contenido dinámico. [file:213]

Incluye:

- **Sitio público**: páginas para innovación, grupo de investigación, semilleros, servicios, aliados, quiénes somos y contacto. [file:213]
- **Panel administrativo**: gestión de noticias, semilleros, proyectos, documentos y contactos.
- **Base de datos**: SQLite con tablas para noticias, semilleros, proyectos, documentos y contactos. [file:213]
- **API REST**: endpoints para CRUD de noticias, semilleros y proyectos.
- **Responsive design**: maquetado con HTML5 + Bootstrap 5.

**Versión**: 1.0  
**Última actualización**: Enero 2026

---

## 🔧 Requisitos Previos

Antes de instalar, asegúrate de tener:

### Software Necesario

| Software | Versión | Descripción | Descargar |
|----------|---------|-------------|-----------|
| **Node.js** | 18.x o superior | Runtime de JavaScript | https://nodejs.org/ |
| **Git** | 2.x o superior | Control de versiones | https://git-scm.com/ |
| **VS Code** (opcional) | Última | Editor de código recomendado | https://code.visualstudio.com/ |

### Verificar instalación

En terminal/CMD:

```bash
node --version      # Debe mostrar v18.x.x o superior
npm --version       # Debe mostrar 9.x.x o superior
git --version       # Debe mostrar 2.x.x o superior
📦 Instalación
En todos los comandos se asume que la carpeta del proyecto se llamará CEAI-WEB.

1. Clonar el repositorio
bash
# Ir a la carpeta donde guardarás el proyecto
cd ruta/donde/guardar/proyecto

# Clonar el repositorio
git clone https://github.com/TU_USUARIO/CEAI-WEB.git

# Entrar a la carpeta
cd CEAI-WEB
2. Instalar dependencias del backend
bash
cd backend
npm install
Dependencias principales (según package.json):

express – servidor web y API REST.

sqlite3 – base de datos embebida.

cors – manejo de CORS para peticiones desde el frontend.

body-parser / express.json – parseo de JSON en las peticiones.

node_modules no se versiona; siempre se genera con npm install.

🚀 Ejecución
El backend Express sirve la API y los archivos estáticos (HTML, CSS, JS, imágenes) desde http://localhost:5000.

1. Iniciar el servidor (desarrollo local)
Desde CEAI-WEB/backend:

bash
node server.js
# o, si tienes script en package.json:
# npm start
Salida esperada (puede variar el texto exacto):

text
✅ Base de datos SQLite conectada
🚀 Servidor corriendo en http://localhost:5000
2. Navegar por el sitio
Con el servidor corriendo, abre en el navegador:

Sitio público (home)
http://localhost:5000/index.html

Secciones principales

http://localhost:5000/innovacion.html

http://localhost:5000/grupo-investigacion.html

http://localhost:5000/semilleros.html

http://localhost:5000/semillero-detalle.html?id=1 (detalle de un semillero)

http://localhost:5000/proyecto-detalle.html?id=1 (detalle de un proyecto)

http://localhost:5000/servicios.html

http://localhost:5000/aliados.html

http://localhost:5000/quienes-somos.html

http://localhost:5000/contacto.html

Panel administrativo
http://localhost:5000/admin.html

En esta versión el panel no tiene autenticación fuerte (entorno de desarrollo). [file:213]

📁 Estructura del Proyecto
text
CEAI-WEB/
├── index.html
├── innovacion.html
├── grupo-investigacion.html
├── semilleros.html
├── semillero-detalle.html
├── proyecto-detalle.html
├── servicios.html
├── aliados.html
├── quienes-somos.html
├── contacto.html
├── admin.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js        # Lógica de frontend (carga de noticias, semilleros, proyectos, etc.)
│   └── datos.js       # Datos/config adicionales en frontend
├── docs/              # Documentos descargables (portafolios, convocatorias, etc.)
├── img/               # Imágenes usadas en el sitio
├── uploads/           # Archivos subidos desde el frontend (si aplica)
├── README.md
└── backend/
    ├── server.js      # Servidor Express + API REST
    ├── package.json   # Dependencias backend
    ├── ceai_db.sqlite # Base de datos SQLite (contenido real)
    └── uploads/       # Imágenes subidas desde el admin
Resumen funcional:

Home: carrusel de noticias destacadas + listado de últimas noticias y semilleros destacados. [file:213]

Semilleros: catálogo general (semilleros.html), detalle de semillero con sus proyectos (semillero-detalle.html) y detalle ampliado de proyecto (proyecto-detalle.html). [file:213]

Panel admin: creación/edición de noticias, semilleros, proyectos y documentos descargables. [file:213]

📡 API REST
Rutas base: http://localhost:5000/api/...

Noticias
text
GET    /api/noticias               # Todas las noticias
GET    /api/noticias/:id           # Una noticia
POST   /api/noticias               # Crear noticia
PUT    /api/noticias/:id           # Actualizar
DELETE /api/noticias/:id           # Eliminar
Semilleros
text
GET    /api/semilleros             # Todos los semilleros
GET    /api/semilleros/:id         # Un semillero
POST   /api/semilleros             # Crear semillero
PUT    /api/semilleros/:id         # Actualizar
DELETE /api/semilleros/:id         # Eliminar
Proyectos
text
GET    /api/proyectos                      # Todos los proyectos
GET    /api/proyectos/:id                  # Un proyecto
GET    /api/proyectos/semillero/:id        # Proyectos por semillero
POST   /api/proyectos                      # Crear proyecto
PUT    /api/proyectos/:id                  # Actualizar
DELETE /api/proyectos/:id                  # Eliminar
Otros módulos (documentos, contactos) siguen la misma convención REST en el backend. [file:213]

💻 Trabajar en otro PC
Para trabajar desde otro computador con el mismo código y los mismos datos:

1. Montar el proyecto
En el otro PC:

bash
git clone https://github.com/TU_USUARIO/CEAI-WEB.git
cd CEAI-WEB/backend
npm install
node server.js
Luego abrir:

http://localhost:5000/index.html

http://localhost:5000/admin.html

2. Compartir la misma base de datos
El contenido real (noticias, semilleros, proyectos creados en el admin) está en backend/ceai_db.sqlite. [file:213]

Para que el otro PC vea exactamente lo mismo:

En el PC original, copia backend/ceai_db.sqlite (USB, correo, nube, etc.).

En el nuevo PC, pega ese archivo en CEAI-WEB/backend/, reemplazando el existente.

Reinicia node server.js.

Normalmente ceai_db.sqlite se excluye con .gitignore, así que los datos no viajan por Git, solo el código. [file:213]

3. Flujo de trabajo con Git
En cada PC:

bash
# Antes de trabajar
git pull

# Después de hacer cambios de código
git add .
git commit -m "Descripción del cambio"
git push
🔧 Solución de Problemas
npm: command not found
Node.js o npm no están instalados o no están en el PATH.

Reinstala desde https://nodejs.org/ y abre una nueva terminal.

El servidor no arranca o el puerto 5000 está en uso
Edita backend/server.js y cambia el puerto:

js
const PORT = 5000; // cámbialo a 5001, por ejemplo
Luego:

bash
cd backend
node server.js
El sitio carga pero no aparecen noticias/semilleros
Verifica que el backend está corriendo (node server.js).

Abre la consola del navegador (F12 → Console) para ver errores.

Asegúrate de que en js/main.js la constante de API coincida:

js
const API = 'https://ceai-web-production.up.railway.app';
Base de datos vacía
Normal la primera vez. Entra al panel admin:

text
http://localhost:5000/admin.html
y crea noticias, semilleros y proyectos desde allí. [file:213]

Acceso desde otro equipo en la misma red (opcional)
En el PC servidor:

Ejecuta ipconfig (Windows) y toma la IP IPv4, por ejemplo 192.168.0.15.

Con el servidor corriendo (node server.js), desde otro PC abre:

http://192.168.0.15:5000/index.html

Puede ser necesario permitir Node en el firewall para conexiones entrantes.

👨‍💻 Autor
Desarrollado por: Geovany Sacri
Instituto: SENA Regional Valle
Año: 2026

📄 Licencia
Proyecto de uso institucional del SENA. Cualquier reutilización externa debe contar con autorización de la entidad. 