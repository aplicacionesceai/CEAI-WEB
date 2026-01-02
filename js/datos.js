// NOTICIAS
const noticias = [
    {
        id: 1,
        titulo: "Lanzamiento de nuevo semillero de IA",
        descripcion: "Se inicia formalmente el semillero de IA Aplicada al Entorno Formativo con expertos en machine learning.",
        fecha: "2026-01-15",
        imagen: "https://via.placeholder.com/400x250?text=IA+Aplicada"
    },
    {
        id: 2,
        titulo: "Alianza estratégica con empresa tecnológica",
        descripcion: "CEAI firma convenio con líder en soluciones digitales para fortalecer capacidades de innovación.",
        fecha: "2026-01-10",
        imagen: "https://via.placeholder.com/400x250?text=Alianza+Tecnologica"
    },
    {
        id: 3,
        titulo: "Convocatoria de proyectos innovadores",
        descripcion: "Se abre convocatoria para presentar proyectos en las líneas de investigación del CEAI.",
        fecha: "2026-01-05",
        imagen: "https://via.placeholder.com/400x250?text=Convocatoria+2026"
    }
];

// SEMILLEROS
const semilleros = [
    {
        id: 1,
        nombre: "Soluciones Digitales e Infraestructura Segura",
        linea: "Transformación Digital",
        enfoque: "Desarrollo de soluciones web y seguridad informática",
        descripcion: "Enfocado en crear aplicaciones web modernas y asegurar la infraestructura tecnológica.",
        imagen: "https://via.placeholder.com/300x200?text=Soluciones+Digitales"
    },
    {
        id: 2,
        nombre: "Automatización e Instrumentación Inteligente",
        linea: "Industria 4.0",
        enfoque: "Automatización de procesos y sistemas de control",
        descripcion: "Desarrollo de sistemas automatizados para la industria manufacturera.",
        imagen: "https://via.placeholder.com/300x200?text=Automatizacion"
    },
    {
        id: 3,
        nombre: "Fábrica Digital Interactiva (FDI)",
        linea: "Manufactura Digital",
        enfoque: "Simulación y control de procesos de manufactura",
        descripcion: "Laboratorio interactivo para la enseñanza de manufactura digital.",
        imagen: "https://via.placeholder.com/300x200?text=Fabrica+Digital"
    },
    {
        id: 4,
        nombre: "Gestión Energética, Transición y Tecnologías Sostenibles (GETES)",
        linea: "Sostenibilidad",
        enfoque: "Eficiencia energética y energías renovables",
        descripcion: "Investigación en tecnologías limpias y gestión sostenible de recursos.",
        imagen: "https://via.placeholder.com/300x200?text=Energia+Sostenible"
    },
    {
        id: 5,
        nombre: "IA Aplicada al Entorno Formativo",
        linea: "Inteligencia Artificial",
        enfoque: "Machine learning para educación",
        descripcion: "Desarrollo de sistemas de IA para mejorar procesos educativos.",
        imagen: "https://via.placeholder.com/300x200?text=IA+Formativa"
    }
];

// PROYECTOS POR SEMILLERO
const proyectos = {
    1: [
        {
            titulo: "Plataforma Web de Gestión de Proyectos",
            estado: "En ejecución",
            aliados: "SENA, Empresa Tecnológica XYZ",
            objetivo: "Desarrollar una plataforma escalable para gestión de proyectos del CEAI",
            entregables: "Código fuente, documentación técnica, manual de usuario",
            evidencia: "Repositorio en GitHub, videos demostrativos"
        },
        {
            titulo: "Sistema de Seguridad Informática",
            estado: "Finalizado",
            aliados: "SENA",
            objetivo: "Auditar y mejorar la seguridad de infraestructura IT",
            entregables: "Reporte de vulnerabilidades, plan de mejora",
            evidencia: "Certificados de seguridad, reporte final"
        }
    ],
    2: [
        {
            titulo: "Brazo Robótico Educativo",
            estado: "En ejecución",
            aliados: "SENA, Fabricante de robots",
            objetivo: "Desarrollar un brazo robótico para prácticas de automatización",
            entregables: "Prototipo funcional, manual de operación",
            evidencia: "Videos de demostración, especificaciones técnicas"
        }
    ],
    3: [
        {
            titulo: "Simulador de Manufactura",
            estado: "En ejecución",
            aliados: "SENA, Software House",
            objetivo: "Crear simulador 3D de procesos de manufactura",
            entregables: "Software interactivo, contenidos educativos",
            evidencia: "Aplicación ejecutable, tutoriales de uso"
        }
    ],
    4: [
        {
            titulo: "Auditoría Energética Regional",
            estado: "En ejecución",
            aliados: "SENA, Empresas locales",
            objetivo: "Realizar diagnóstico de eficiencia energética en PYMES",
            entregables: "Reportes de auditoría, recomendaciones",
            evidencia: "Informes técnicos, gráficas de resultados"
        }
    ],
    5: [
        {
            titulo: "Sistema Recomendador de Cursos",
            estado: "En ejecución",
            aliados: "SENA, Plataforma de Learning",
            objetivo: "Usar ML para recomendar cursos personalizados a estudiantes",
            entregables: "Modelo de IA, integración en LMS",
            evidencia: "Código Python, reportes de precisión"
        }
    ]
};
