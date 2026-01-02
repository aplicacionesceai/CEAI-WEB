const API = 'http://localhost:5000/api';

// Cargar noticias desde API
async function cargarNoticias() {
    const container = document.getElementById('noticiasContainer');
    if (!container) return;

    try {
        const response = await fetch(`${API}/noticias`);
        const noticias = await response.json();

        container.innerHTML = noticias.map(noticia => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 card-noticia">
                    <img src="${noticia.imagen || 'https://via.placeholder.com/400x250'}" class="card-img-top" alt="${noticia.titulo}">
                    <div class="card-body">
                        <small class="text-muted">${new Date(noticia.fecha).toLocaleDateString('es-ES')}</small>
                        <h5 class="card-title mt-2">${noticia.titulo}</h5>
                        <p class="card-text">${noticia.descripcion}</p>
                    </div>
                    <div class="card-footer bg-transparent">
                        <a href="#" class="btn btn-ceai btn-sm w-100">Leer más</a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error cargando noticias:', error);
    }
}

// Cargar semilleros desde API
async function cargarSemillerosHome() {
    const container = document.getElementById('semillerosContainer');
    if (!container) return;

    try {
        const response = await fetch(`${API}/semilleros`);
        const semilleros = await response.json();

        container.innerHTML = semilleros.map(semillero => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 card-semillero">
                    <img src="${semillero.imagen || 'https://via.placeholder.com/300x200'}" class="card-img-top" alt="${semillero.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${semillero.nombre}</h5>
                        <p class="card-text small">${semillero.enfoque}</p>
                        <a href="semillero-detalle.html?id=${semillero.id}" class="btn btn-outline-ceai btn-sm w-100">Ver proyectos</a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error cargando semilleros:', error);
    }
}

// Cargar semilleros en página de semilleros
async function cargarSemillerosPagina() {
    const container = document.getElementById('semillerosListContainer');
    if (!container) return;

    try {
        const response = await fetch(`${API}/semilleros`);
        const semilleros = await response.json();

        container.innerHTML = semilleros.map(semillero => `
            <div class="col-md-6 mb-4">
                <div class="card h-100">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${semillero.imagen || 'https://via.placeholder.com/300x200'}" class="img-fluid rounded-start" alt="${semillero.nombre}" style="height: 200px; object-fit: cover;">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${semillero.nombre}</h5>
                                <p class="card-text small"><strong>Línea:</strong> ${semillero.linea}</p>
                                <p class="card-text">${semillero.descripcion}</p>
                                <a href="semillero-detalle.html?id=${semillero.id}" class="btn btn-ceai btn-sm">Ver proyectos</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error cargando semilleros:', error);
    }
}

// Cargar proyectos en página de detalle de semillero
async function cargarProyectosSemillero() {
    const urlParams = new URLSearchParams(window.location.search);
    const semilleroId = parseInt(urlParams.get('id')) || 1;
    
    try {
        const semillerosResponse = await fetch(`${API}/semilleros`);
        const semilleros = await semillerosResponse.json();
        const semillero = semilleros.find(s => s.id === semilleroId);

        const proyectosResponse = await fetch(`${API}/proyectos/semillero/${semilleroId}`);
        const proyectos = await proyectosResponse.json();
        
        const container = document.getElementById('proyectosContainer');
        if (!container) return;

        document.getElementById('semilleroTitle').textContent = semillero ? semillero.nombre : 'Semillero no encontrado';

        container.innerHTML = proyectos.map((proyecto, index) => `
            <div class="col-md-6 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${proyecto.titulo}</h5>
                        <p class="card-text">
                            <strong>Estado:</strong> <span class="badge ${proyecto.estado === 'En ejecución' ? 'bg-primary' : 'bg-success'}">${proyecto.estado}</span>
                        </p>
                        <p class="card-text"><strong>Objetivo:</strong> ${proyecto.objetivo}</p>
                        <p class="card-text"><strong>Aliados:</strong> ${proyecto.aliados}</p>
                        <p class="card-text"><strong>Entregables:</strong> ${proyecto.entregables}</p>
                        <p class="card-text"><strong>Evidencia:</strong> ${proyecto.evidencia}</p>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error cargando proyectos:', error);
    }
}

// Manejar envío del formulario de contacto
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const asunto = document.getElementById('asunto').value;
        const mensaje = document.getElementById('mensaje').value;

        console.log({nombre, email, asunto, mensaje});
        
        alert('¡Mensaje enviado! Nos contactaremos pronto.');
        form.reset();
    });
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarNoticias();
    cargarSemillerosHome();
    cargarSemillerosPagina();
    cargarProyectosSemillero();
    setupContactForm();
});
