// Cargar noticias en el HOME
function cargarNoticias() {
    const container = document.getElementById('noticiasContainer');
    if (!container) return;

    container.innerHTML = noticias.map(noticia => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 card-noticia">
                <img src="${noticia.imagen}" class="card-img-top" alt="${noticia.titulo}">
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
}

// Cargar semilleros en el HOME
function cargarSemillerosHome() {
    const container = document.getElementById('semillerosContainer');
    if (!container) return;

    container.innerHTML = semilleros.map(semillero => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 card-semillero">
                <img src="${semillero.imagen}" class="card-img-top" alt="${semillero.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${semillero.nombre}</h5>
                    <p class="card-text small">${semillero.enfoque}</p>
                    <a href="semillero-detalle.html?id=${semillero.id}" class="btn btn-outline-ceai btn-sm w-100">Ver proyectos</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Cargar todos los semilleros en página de semilleros
function cargarSemillerosPagina() {
    const container = document.getElementById('semillerosListContainer');
    if (!container) return;

    container.innerHTML = semilleros.map(semillero => `
        <div class="col-md-6 mb-4">
            <div class="card h-100">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${semillero.imagen}" class="img-fluid rounded-start" alt="${semillero.nombre}" style="height: 200px; object-fit: cover;">
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
}

// Cargar proyectos en página de detalle de semillero
function cargarProyectosSemillero() {
    const urlParams = new URLSearchParams(window.location.search);
    const semilleroId = parseInt(urlParams.get('id')) || 1;
    
    const semillero = semilleros.find(s => s.id === semilleroId);
    const proyectosList = proyectos[semilleroId] || [];
    
    const container = document.getElementById('proyectosContainer');
    if (!container) return;

    document.getElementById('semilleroTitle').textContent = semillero ? semillero.nombre : 'Semillero no encontrado';

    container.innerHTML = proyectosList.map((proyecto, index) => `
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

        // Simular envío (en producción, esto iría a un backend)
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
