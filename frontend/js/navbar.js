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
            // don't set inline styles; let CSS handle visibility so hover still works
        }
        toggle.setAttribute('aria-expanded', 'true');
    } catch (err) {
        console.error('Error abriendo dropdown de semilleros:', err);
    }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.debug('[navbar] DOMContentLoaded - inicializando navbar.js');

    // Cargar items del dropdown y después decidir si abrirlo
    // Use catch so listeners are attached even if loading fails
    cargarSemillerosDropdown().catch(()=>{}).then(() => {
        console.debug('[navbar] cargarSemillerosDropdown: done');
        const toggle = document.getElementById('semillerosDropdown');
        if (toggle) console.debug('[navbar] semillerosDropdown encontrado'); else console.debug('[navbar] semillerosDropdown NO encontrado');

        if (isSemillerosPage()) {
            console.debug('[navbar] isSemillerosPage -> abrirDropdownSemilleros');
            abrirDropdownSemilleros();
        }

        // Añadir listeners por JS para abrir/ cerrar el dropdown al pasar el mouse
        try {
            if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                const toggleEl = document.getElementById('semillerosDropdown');
                if (toggleEl) {
                    const dropdownItem = toggleEl.closest('.nav-item.dropdown') || toggleEl.parentElement;
                    const menu = dropdownItem ? dropdownItem.querySelector('.dropdown-menu') : null;
                    console.debug('[navbar] dropdownItem/menu encontrados:', !!dropdownItem, !!menu);
                    if (dropdownItem) {
                        // Attach more robust hover handlers to dropdownItem, toggle and menu
                        if (!dropdownItem.__hoverBound) {
                            let closeTimer = null;
                            function abrir() {
                                dropdownItem.classList.add('show');
                                if (menu) menu.classList.add('show');
                                toggleEl.setAttribute('aria-expanded','true');
                            }
                            function cerrar() {
                                dropdownItem.classList.remove('show');
                                if (menu) menu.classList.remove('show');
                                toggleEl.setAttribute('aria-expanded','false');
                            }

                            const scheduleClose = () => {
                                if (closeTimer) clearTimeout(closeTimer);
                                closeTimer = setTimeout(() => { cerrar(); closeTimer = null; }, 200);
                            };

                            const cancelClose = () => {
                                if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
                            };

                            // Bind on dropdownItem, toggle and menu so hover works reliably
                            dropdownItem.addEventListener('mouseenter', () => { cancelClose(); abrir(); });
                            dropdownItem.addEventListener('mouseleave', () => { scheduleClose(); });

                            toggleEl.addEventListener('mouseenter', () => { cancelClose(); abrir(); });
                            toggleEl.addEventListener('mouseleave', () => { scheduleClose(); });

                            if (menu) {
                                menu.addEventListener('mouseenter', () => { cancelClose(); abrir(); });
                                menu.addEventListener('mouseleave', () => { scheduleClose(); });
                            }

                            dropdownItem.__hoverBound = true;
                            console.debug('[navbar] hover listeners attached');
                        }
                    }
                } else {
                    console.debug('[navbar] toggleEl no encontrado, no se adjuntan listeners');
                }
            } else {
                console.debug('[navbar] dispositivo no soporta hover, no se adjuntan listeners');
            }
        } catch (err) {
            console.error('Error attaching hover listeners for semilleros dropdown', err);
        }
    });
});

// --- Fallback: abrir dropdown si el cursor está en la franja superior (útil cuando hover directo no se dispara)
document.addEventListener('DOMContentLoaded', function() {
    try {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return; // solo desktop
        if (!isSemillerosPage()) return; // solo en páginas de semilleros

        const toggle = document.getElementById('semillerosDropdown');
        if (!toggle) return;
        const dropdownItem = toggle.closest('.nav-item.dropdown') || toggle.parentElement;
        const menu = dropdownItem ? dropdownItem.querySelector('.dropdown-menu') : null;
        if (!dropdownItem) return;

        let openedByTop = false;
        const TOP_ZONE = 120; // px desde la parte superior donde se abrirá el dropdown

        function openDropdown() {
            if (!openedByTop) {
                dropdownItem.classList.add('show');
                if (menu) menu.classList.add('show');
                toggle.setAttribute('aria-expanded', 'true');
                openedByTop = true;
            }
        }
        function closeDropdown() {
            if (openedByTop) {
                dropdownItem.classList.remove('show');
                if (menu) menu.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
                openedByTop = false;
            }
        }

        document.addEventListener('mousemove', function(e) {
            try {
                if (e.clientY <= TOP_ZONE) {
                    openDropdown();
                } else {
                    // cerramos solo si el cursor no está sobre el propio toggle o el menú
                    const rectT = toggle.getBoundingClientRect();
                    const rectM = menu ? menu.getBoundingClientRect() : null;
                    const x = e.clientX, y = e.clientY;
                    const overToggle = x >= rectT.left && x <= rectT.right && y >= rectT.top && y <= rectT.bottom;
                    const overMenu = rectM && x >= rectM.left && x <= rectM.right && y >= rectM.top && y <= rectM.bottom;
                    if (!overToggle && !overMenu) closeDropdown();
                }
            } catch (err) {
                // ignore
            }
        });

        // también cerrar al hacer scroll hacia abajo
        window.addEventListener('scroll', function() {
            closeDropdown();
        });
    } catch (err) {
        console.error('Error en fallback top-zone dropdown:', err);
    }
});
