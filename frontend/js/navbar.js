// navbar.js - Genera el dropdown dinámico de semilleros en todas las páginas
// y fuerza su apertura cuando la página actual pertenece a la sección "semilleros".

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
        const toggle = document.getElementById('semillerosDropdown');
        if (!toggle) return;
        const dropdownMenu = toggle.parentElement.querySelector('.dropdown-menu');
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

function isSemillerosPage() {
    const path = window.location.pathname || '';
    const filename = path.substring(path.lastIndexOf('/') + 1).toLowerCase();
    const search = window.location.search || '';

    if (filename === 'semilleros.html' || filename === 'semillero-detalle.html' || filename.startsWith('semillero')) return true;
    if (search.includes('categoria=') || search.includes('id=')) return true;
    // also check pathname containing semilleros (fallback)
    if (path.toLowerCase().includes('semilleros')) return true;
    return false;
}

function abrirDropdownSemilleros() {
    try {
        const toggle = document.getElementById('semillerosDropdown');
        if (!toggle) return;

        // Limitamos la apertura forzada a dispositivos con puntero (escritorio)
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        const dropdownItem = toggle.closest('.nav-item.dropdown') || toggle.parentElement;
        const menu = dropdownItem ? dropdownItem.querySelector('.dropdown-menu') : null;

        if (dropdownItem) dropdownItem.classList.add('show');
        if (menu) {
            menu.classList.add('show');
            menu.style.display = 'block';
        }
        toggle.setAttribute('aria-expanded', 'true');
    } catch (err) {
        console.error('Error abriendo dropdown de semilleros:', err);
    }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Cargar items del dropdown y después decidir si abrirlo
    cargarSemillerosDropdown().then(() => {
        if (isSemillerosPage()) {
            abrirDropdownSemilleros();
        }
    });
});
