// navbar.js - Genera el dropdown dinámico de semilleros en todas las páginas

const API = 'https://ceai-web-production.up.railway.app';

async function cargarSemillerosDropdown() {
    try {
        const response = await fetch(API + '/api/semilleros');
        const semilleros = await response.json();
        
        // Agrupar por categoría
        const categorias = {};
        semilleros.forEach(s => {
            const cat = s.categoria || 'Sin categoría';
            if (!categorias[cat]) {
                categorias[cat] = [];
            }
            categorias[cat].push(s);
        });
        
        // Generar el HTML del dropdown
        let dropdownHTML = '<li><a class="dropdown-item" href="semilleros.html">📚 Ver todos los semilleros</a></li>';
        dropdownHTML += '<li><hr class="dropdown-divider"></li>';
        dropdownHTML += '<li><h6 class="dropdown-header">Por categoría:</h6></li>';
        
        // Agregar cada categoría
        for (let cat in categorias) {
            // URL encode la categoría
            const catEncoded = encodeURIComponent(cat);
            const icon = getIconoCategoria(cat);
            dropdownHTML += `<li><a class="dropdown-item" href="semillero-detalle.html?categoria=${catEncoded}">${icon} ${cat}</a></li>`;
        }
        
        // Inyectar en el dropdown
        const dropdownMenu = document.querySelector('#semillerosDropdown').parentElement.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.innerHTML = dropdownHTML;
        }
    } catch (err) {
        console.error('Error cargando semilleros dropdown:', err);
    }
}

function getIconoCategoria(categoria) {
    const iconos = {
        'Soluciones Digitales': '💻',
        'Automatización e Instrumentación': '🤖',
        'Fábrica Digital Interactiva': '🏭',
        'Gestión Energética': '⚡',
        'IA Aplicada al Entorno': '🧠'
    };
    return iconos[categoria] || '📚';
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    cargarSemillerosDropdown();
});
