const API = 'https://ceai-web-production.up.railway.app';


// ==================== CAROUSEL NOTICIAS DESTACADAS ====================
async function cargarNoticiasDestacadas() {
    const container = document.getElementById('carouselContent');
    if (!container) return;

    try {
        const response = await fetch(`${API}/noticias`);
        const noticias = await response.json();

        // Filtra solo las destacadas
        const destacadas = noticias.filter(n => n.destacada === 1);

        if (!destacadas.length) {
            container.innerHTML = `
                <div class="carousel-item active">
                    <div class="text-center py-5">
                        <p class="text-white-50">No hay noticias destacadas aún.</p>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = destacadas.map((noticia, index) => {
            const tipo = noticia.tipo || 'Noticia';
            const badgeClass =
                tipo === 'Evento'       ? 'bg-info' :
                tipo === 'Convocatoria' ? 'bg-warning text-dark' :
                tipo === 'Resultado'    ? 'bg-success' :
                                          'bg-secondary';
            
            const fechaTexto = noticia.fecha
                ? new Date(noticia.fecha).toLocaleDateString('es-ES')
                : '';

            return `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <div class="row align-items-center g-0 py-5">
                        <div class="col-md-6">
                            <img src="${noticia.imagen || 'https://via.placeholder.com/600x400'}" 
                                 class="d-block w-100" 
                                 alt="${noticia.titulo}"
                                 style="height: 400px; object-fit: cover; border-radius: 10px;">
                        </div>
                        <div class="col-md-6 ps-md-5 mt-4 mt-md-0">
                            <div class="mb-3">
                                <span class="badge ${badgeClass} me-2">${tipo}</span>
                                <small class="text-white-50">${fechaTexto}</small>
                            </div>
                            <h3 class="display-6 fw-bold mb-3" style="color: white;">${noticia.titulo}</h3>
                            <p class="fs-5 mb-4" style="color: rgba(255,255,255,0.85);">${noticia.descripcion}</p>
                            <a href="#" class="btn btn-light btn-lg">
                                Leer más →
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error cargando noticias destacadas:', error);
        container.innerHTML = `
            <div class="carousel-item active">
                <div class="text-center py-5">
                    <p class="text-danger">Error al cargar noticias destacadas.</p>
                </div>
            </div>
        `;
    }
}

// ==================== NOTICIAS HOME ====================
async function cargarNoticias() {
    const container = document.getElementById('noticiasContainer');
    if (!container) return;

    try {
        const response = await fetch(`${API}/noticias`);
        const noticias = await response.json();

        if (!noticias.length) {
            container.innerHTML = '<p class="text-muted text-center">No hay noticias registradas.</p>';
            return;
        }

        // Tomamos las últimas 6 y las mostramos
        const ultimas = noticias.slice(-6).reverse();

        container.innerHTML = ultimas.map(noticia => {
            const tipo = noticia.tipo || 'Noticia';
            const badgeClass =
                tipo === 'Evento'       ? 'bg-info' :
                tipo === 'Convocatoria' ? 'bg-warning text-dark' :
                tipo === 'Resultado'    ? 'bg-success' :
                                          'bg-secondary';

            const fechaTexto = noticia.fecha
                ? new Date(noticia.fecha).toLocaleDateString('es-ES')
                : '';

            return `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100 card-noticia">
                        <img src="${noticia.imagen || 'https://via.placeholder.com/400x250'}" class="card-img-top" alt="${noticia.titulo}">
                        <div class="card-body d-flex flex-column">
                            <div class="mb-2 d-flex justify-content-between align-items-center">
                                <span class="badge ${badgeClass}">${tipo}</span>
                                <small class="text-muted">${fechaTexto}</small>
                            </div>
                            <h5 class="card-title">${noticia.titulo}</h5>
                            <p class="card-text flex-grow-1">${noticia.descripcion}</p>
                        </div>
                        <div class="card-footer bg-transparent">
                            <a href="#" class="btn btn-ceai btn-sm w-100">Leer más</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error cargando noticias:', error);
        container.innerHTML = '<p class="text-danger text-center">Error al cargar noticias.</p>';
    }
}

// ==================== SEMILLEROS HOME ====================
async function cargarSemillerosHome() {
    const container = document.getElementById('semillerosContainer');
    if (!container) return;

    try {
        const response = await fetch(`${API}/semilleros`);
        const semilleros = await response.json();

        if (!semilleros.length) {
            container.innerHTML = '<p class="text-muted text-center">No hay semilleros registrados.</p>';
            return;
        }

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
        container.innerHTML = '<p class="text-danger text-center">Error al cargar semilleros.</p>';
    }
}

// ==================== SEMILLEROS PÁGINA ====================
async function cargarSemillerosPagina() {
    const container = document.getElementById('semillerosListContainer');
    if (!container) return;

    try {
        const response = await fetch(`${API}/semilleros`);
        const semilleros = await response.json();

        if (!semilleros.length) {
            container.innerHTML = '<p class="text-muted">No hay semilleros registrados.</p>';
            return;
        }

        container.innerHTML = semilleros.map(semillero => `
            <div class="col-md-6 mb-4">
                <div class="card h-100">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${semillero.imagen || 'https://via.placeholder.com/300x200'}"
                                 class="img-fluid rounded-start"
                                 alt="${semillero.nombre}"
                                 style="height: 200px; object-fit: cover;">
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
        container.innerHTML = '<p class="text-danger">Error al cargar semilleros.</p>';
    }
}

// ==================== PROYECTOS POR SEMILLERO ====================
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

        const title = document.getElementById('semilleroTitle');
        if (title) {
            title.textContent = semillero ? semillero.nombre : 'Semillero no encontrado';
        }

        if (!proyectos.length) {
            container.innerHTML = '<p class="text-muted">No hay proyectos registrados para este semillero.</p>';
            return;
        }

        container.innerHTML = proyectos.map((proyecto) => `
            <div class="col-md-6 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${proyecto.titulo}</h5>
                        <p class="card-text">
                            <strong>Estado:</strong> 
                            <span class="badge ${proyecto.estado === 'En ejecución' ? 'bg-primary' : 'bg-success'}">
                                ${proyecto.estado}
                            </span>
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

// ==================== DOCUMENTOS EN SERVICIOS ====================
async function cargarDocumentosServicios() {
    const container = document.getElementById('documentosServicios');
    if (!container) return;

    try {
        const response = await fetch(`${API}/documentos`);
        const documentos = await response.json();

        if (!documentos.length) {
            container.innerHTML = '<p class="text-muted mb-0">Próximamente documentos para descarga.</p>';
            return;
        }

        container.innerHTML = documentos.map(doc => `
            <a href="${doc.ruta_archivo}"
               class="btn btn-outline-success"
               target="_blank"
               rel="noopener noreferrer">
                📄 ${doc.nombre} (${doc.tipo})
            </a>
        `).join('');
    } catch (error) {
        console.error('Error cargando documentos de servicios:', error);
        container.innerHTML = '<p class="text-danger mb-0">No se pudieron cargar los documentos.</p>';
    }
}

// ==================== FORMULARIO CONTACTO ====================
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const asunto = document.getElementById('asunto').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        try {
            const response = await fetch(`${API}/contactos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, asunto, mensaje })
            });

            if (response.ok) {
                if (typeof toast !== 'undefined') {
                    toast.success('¡Mensaje enviado! Nos contactaremos pronto.');
                } else {
                    alert('¡Mensaje enviado! Nos contactaremos pronto.');
                }
                form.reset();
            } else {
                const error = await response.json();
                if (typeof toast !== 'undefined') {
                    toast.error('Error: ' + (error.error || 'No se pudo enviar.'));
                } else {
                    alert('Error: ' + (error.error || 'No se pudo enviar.'));
                }
            }
        } catch (error) {
            console.error('Error enviando contacto:', error);
            if (typeof toast !== 'undefined') {
                toast.error('Error al enviar: ' + error.message);
            } else {
                alert('Error al enviar: ' + error.message);
            }
        }
    });
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    cargarNoticiasDestacadas();
    cargarNoticias();
    cargarSemillerosHome();
    cargarSemillerosPagina();
    cargarProyectosSemillero();
    cargarDocumentosServicios();
    setupContactForm();
});
