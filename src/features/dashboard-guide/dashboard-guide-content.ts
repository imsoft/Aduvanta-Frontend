export type GuideLocale = 'es-MX' | 'en-US'

export type GuidePageItem = {
  path: string
  title: string
  bullets: string[]
}

export type GuideGroup = {
  title: string
  pages: GuidePageItem[]
}

export type DashboardGuideContent = {
  metaTitle: string
  metaDescription: string
  pageTitle: string
  pageSubtitle: string
  intro: string
  permissionsNote: string
  settingsNote: string
  tenantSectionTitle: string
  adminSectionTitle: string
  adminIntro: string
  extraRoutesTitle: string
  extraRoutes: { path: string; title: string; description: string }[]
  tenantGroups: GuideGroup[]
  adminGroups: GuideGroup[]
}

const es: DashboardGuideContent = {
  metaTitle: 'Guía del panel',
  metaDescription:
    'Resumen de cada sección del panel Aduvanta: operaciones, aduanas, control, sistema y administración de tu organización.',
  pageTitle: 'Guía del panel',
  pageSubtitle: 'Qué hace cada sección y qué puedes hacer en ella',
  intro:
    'Aduvanta concentra la operación aduanal y de comercio exterior de tu agencia: expedientes, pedimentos, almacén, finanzas y gobierno de la plataforma. Usa esta guía como mapa del menú lateral.',
  permissionsNote:
    'Algunas pantallas dependen de tu rol y permisos. Si no ves un módulo o una acción, pide acceso al administrador de tu organización.',
  settingsNote:
    'Configuración personal y de sesión (idioma, tema claro/oscuro, perfil) está en el ícono de engrane al final del menú lateral.',
  tenantSectionTitle: 'Tu organización',
  adminSectionTitle: 'Super Admin — Plataforma',
  adminIntro:
    'Estas secciones solo aplican si tienes rol de administrador del sistema. Gestionan todas las organizaciones (tenants), uso global y configuración de la plataforma.',
  extraRoutesTitle: 'Otras rutas del panel',
  extraRoutes: [
    {
      path: '/dashboard/imports',
      title: 'Importaciones',
      description: 'Cargas masivas de datos (archivos) hacia la plataforma, según las plantillas y permisos habilitados.',
    },
    {
      path: '/dashboard/exports',
      title: 'Exportaciones',
      description: 'Descarga de información en lote para análisis externo o respaldos operativos.',
    },
  ],
  tenantGroups: [
    {
      title: 'Inicio y operación',
      pages: [
        {
          path: '/dashboard',
          title: 'Panel',
          bullets: [
            'Vista general con indicadores: operaciones activas, pedimentos del periodo, saldos o pendientes de cobro, vencimientos de padrón, inventario resumido y desglose de pedimentos por estatus.',
            'Sirve como tablero diario para priorizar excepciones (pagos, vencimientos, carga de almacén).',
            'Accesos rápidos a módulos frecuentes según el diseño del producto.',
          ],
        },
        {
          path: '/dashboard/operations',
          title: 'Operaciones',
          bullets: [
            'Listado de expedientes u operaciones con búsqueda, filtro por estatus y prioridad.',
            'Cada expediente concentra el trabajo end-to-end con el cliente: documentos, cargos, seguimiento y coordinación del equipo.',
            'Alta de nuevas operaciones y apertura del detalle para ver y editar la información de la operación.',
          ],
        },
        {
          path: '/dashboard/clients',
          title: 'Clientes',
          bullets: [
            'Directorio de clientes (importadores o contratantes) con datos de contacto y fiscales básicos.',
            'Ficha del cliente: operaciones vinculadas, domicilios, contactos y, según permisos, estados de cuenta o documentación.',
            'Base para asociar pedimentos, pedidos y facturación a la razón social correcta.',
          ],
        },
      ],
    },
    {
      title: 'Aduanas',
      pages: [
        {
          path: '/dashboard/pedimentos',
          title: 'Pedimentos',
          bullets: [
            'Listado de pedimentos de importación/exportación con filtros y estados del flujo (borrador, validado, pagado, etc.).',
            'Alta y edición de pedimentos, detalle por partida, vinculación a operaciones y clientes.',
            'Punto central para alinear trámites con ventanilla y la operación interna de la agencia.',
          ],
        },
        {
          path: '/dashboard/clasificacion',
          title: 'Clasificación arancelaria',
          bullets: [
            'Herramientas de fracción TIGIE: búsqueda, notas, reglas y apoyo a la correcta clasificación de mercancías.',
            'Reduce riesgo de multas o rectificaciones por fracción incorrecta.',
            'Suele usarse en conjunto con pedimentos y el motor de cumplimiento documental.',
          ],
        },
        {
          path: '/dashboard/inspecciones',
          title: 'Inspecciones',
          bullets: [
            'Seguimiento de reconocimientos aduaneros, visitas o inspecciones y su estatus (p. ej. enfoque tipo semáforo).',
            'Coordinación del equipo frente a retrasos o requerimientos de la autoridad.',
            'Vinculación con la operación y expedientes que están sujetos a reconocimiento.',
          ],
        },
        {
          path: '/dashboard/previos',
          title: 'Previos',
          bullets: [
            'Gestión de previos de mercancía antes del despacho definitivo.',
            'Seguimiento por pedimento o referencia y comunicación con cliente y almacén.',
            'Apoyo al cumplimiento de tiempos y documentación en operaciones sensibles al tiempo.',
          ],
        },
      ],
    },
    {
      title: 'Control',
      pages: [
        {
          path: '/dashboard/bodega',
          title: 'Bodega',
          bullets: [
            'Inventario físico y existencias por cliente, ubicación o referencia según configuración.',
            'Movimientos de entrada/salida ligados a operaciones y pedimentos cuando aplique.',
            'Control operativo del almacén fiscal o contenedor de mercancías en custodia.',
          ],
        },
        {
          path: '/dashboard/tesoreria',
          title: 'Tesorería',
          bullets: [
            'Cuenta corriente de clientes: anticipos, aplicaciones de pagos, adeudos y estados de cuenta.',
            'Coordinación con fondos o cuentas según las subrutas de tesorería del producto.',
            'Base para cuadrar ingresos con operaciones y pedimentos pagados.',
          ],
        },
        {
          path: '/dashboard/padron',
          title: 'Padrón',
          bullets: [
            'Consulta y seguimiento del padrón de importadores (general/sectorial) y fechas de vigencia.',
            'Rutas dedicadas a IMMEX u otros programas cuando estén habilitadas.',
            'Alertas de vencimiento para evitar operaciones con RFC no vigente en el padrón.',
          ],
        },
        {
          path: '/dashboard/reportes',
          title: 'Reportes',
          bullets: [
            'Reportes operativos y ejecutivos: volumen de operaciones, pedimentos, mercancías, etc.',
            'Exportación o vista para dirección y cumplimiento interno.',
            'Complementa el panel principal con cortes por periodo o cliente.',
          ],
        },
        {
          path: '/dashboard/conversiones',
          title: 'Conversiones',
          bullets: [
            'Conversor de unidades de medida y tipos de cambio (incluye referencias útiles para valoración y cotización).',
            'Herramienta de apoyo para clasificación, cotización y documentación sin salir del panel.',
          ],
        },
      ],
    },
    {
      title: 'Sistema',
      pages: [
        {
          path: '/dashboard/compliance/rule-sets',
          title: 'Cumplimiento',
          bullets: [
            'Conjuntos de reglas de cumplimiento documental: qué documentos exige cada tipo de operación o cliente.',
            'Creación y mantenimiento de reglas; evaluación del estado de cumplimiento en expedientes.',
            'Integración con documentos y categorías para estandarizar la calidad del expediente.',
          ],
        },
        {
          path: '/dashboard/document-categories',
          title: 'Categorías documentales',
          bullets: [
            'Taxonomía de tipos de documento que usa tu organización (contratos, facturas, cartas, etc.).',
            'Ordena la carga y el cumplimiento en operaciones y pedimentos.',
          ],
        },
        {
          path: '/dashboard/ai',
          title: 'Copiloto IA',
          bullets: [
            'Asistente para consultas sobre regulación, fracciones o procedimiento según el alcance configurado.',
            'Búsqueda asistida que devuelve respuestas estructuradas para acelerar investigación operativa.',
            'No sustituye el criterio del agente aduanal ni la normativa oficial; úsalo como apoyo.',
          ],
        },
        {
          path: '/dashboard/integrations',
          title: 'Integraciones',
          bullets: [
            'Conexiones con sistemas externos (ERP, contabilidad, correo, almacén, etc.) según lo habilitado para tu organización.',
            'Gestión de credenciales y estado de sincronización donde aplique.',
          ],
        },
      ],
    },
    {
      title: 'Administración de la organización',
      pages: [
        {
          path: '/dashboard/organizations',
          title: 'Organizaciones',
          bullets: [
            'Alta y administración de organizaciones (tenants) cuando tu cuenta tenga varias razones o marcas bajo la misma suscripción.',
            'Contexto del selector de organización en la cabecera del panel.',
          ],
        },
        {
          path: '/dashboard/users',
          title: 'Usuarios',
          bullets: [
            'Invitación y administración de usuarios del tenant: correo, nombre y pertenencia a la organización.',
            'Desactivación o ajuste de accesos según políticas internas.',
          ],
        },
        {
          path: '/dashboard/roles',
          title: 'Roles',
          bullets: [
            'Definición de roles y permisos (RBAC) sobre módulos y acciones sensibles.',
            'Permite separar tramitación, tesorería, administración y solo lectura.',
          ],
        },
        {
          path: '/dashboard/audit-logs',
          title: 'Registros de auditoría',
          bullets: [
            'Historial de acciones relevantes en el tenant para trazabilidad y cumplimiento.',
            'Consulta por usuario, recurso o fecha según filtros del producto.',
          ],
        },
        {
          path: '/dashboard/billing',
          title: 'Facturación',
          bullets: [
            'Plan de suscripción, método de pago y estado de la cuenta de Aduvanta.',
            'Facturas o recibos según integración de cobro.',
          ],
        },
        {
          path: '/dashboard/usage',
          title: 'Uso',
          bullets: [
            'Métricas de consumo del plan (usuarios, volumen u otros límites según contrato).',
            'Ayuda a anticipar upgrades o ajustes de licencias.',
          ],
        },
        {
          path: '/dashboard/feature-flags',
          title: 'Flags de función',
          bullets: [
            'Funcionalidades experimentales o por etapas habilitadas solo para tu organización.',
            'Visible según permisos de administrador del tenant.',
          ],
        },
      ],
    },
  ],
  adminGroups: [
    {
      title: 'Resumen y salud',
      pages: [
        {
          path: '/dashboard/admin',
          title: 'Panel Super Admin',
          bullets: [
            'Indicadores globales de la plataforma: organizaciones, usuarios, actividad reciente y accesos rápidos a otros módulos admin.',
            'Vista única para soporte y dirección de producto.',
          ],
        },
        {
          path: '/dashboard/admin/health',
          title: 'Estado del sistema',
          bullets: [
            'Salud de servicios dependientes (API, base de datos, colas, etc.) para diagnóstico operativo.',
            'Uso típico por equipos de infraestructura o soporte N2.',
          ],
        },
      ],
    },
    {
      title: 'Actividad cruzada',
      pages: [
        {
          path: '/dashboard/admin/pedimentos',
          title: 'Pedimentos (global)',
          bullets: [
            'Visión transversal de pedimentos entre organizaciones para soporte o auditoría de plataforma.',
            'Filtros y detalle para investigar incidencias sin cambiar de tenant manualmente en todos los casos.',
          ],
        },
        {
          path: '/dashboard/admin/operaciones',
          title: 'Operaciones (global)',
          bullets: [
            'Listado de expedientes u operaciones a nivel plataforma para seguimiento y soporte.',
          ],
        },
      ],
    },
    {
      title: 'Tenants y cobro',
      pages: [
        {
          path: '/dashboard/admin/organizations',
          title: 'Organizaciones',
          bullets: [
            'Administración de organizaciones: creación, estado, límites y metadatos de cada tenant.',
          ],
        },
        {
          path: '/dashboard/admin/uso',
          title: 'Uso por organización',
          bullets: [
            'Consumo agregado por cliente/tenant para facturación y optimización de planes.',
          ],
        },
        {
          path: '/dashboard/admin/users',
          title: 'Usuarios (global)',
          bullets: [
            'Búsqueda y administración de usuarios en toda la plataforma; típico para soporte y seguridad.',
          ],
        },
        {
          path: '/dashboard/admin/sesiones',
          title: 'Sesiones activas',
          bullets: [
            'Inspección de sesiones o dispositivos conectados para seguridad y soporte.',
          ],
        },
        {
          path: '/dashboard/admin/suscripciones',
          title: 'Suscripciones',
          bullets: [
            'Estado de suscripciones Stripe u otros proveedores, alineado con planes comerciales.',
          ],
        },
      ],
    },
    {
      title: 'Configuración de plataforma',
      pages: [
        {
          path: '/dashboard/admin/anuncios',
          title: 'Anuncios',
          bullets: [
            'Banners o comunicados globales (mantenimiento, novedades) visibles en el panel de clientes.',
          ],
        },
        {
          path: '/dashboard/admin/descuentos',
          title: 'Descuentos',
          bullets: [
            'Códigos o campañas promocionales aplicadas al cobro de suscripción.',
          ],
        },
        {
          path: '/dashboard/admin/feature-flags',
          title: 'Feature flags (global)',
          bullets: [
            'Activación gradual de funcionalidades por tenant o por porcentaje de usuarios.',
          ],
        },
        {
          path: '/dashboard/admin/catalogos',
          title: 'Catálogos SAT',
          bullets: [
            'Mantenimiento o sincronización de catálogos oficiales que consume el producto (Anexo 22 y afines).',
          ],
        },
        {
          path: '/dashboard/admin/audit-logs',
          title: 'Audit logs (plataforma)',
          bullets: [
            'Registro de acciones sensibles a nivel sistema para cumplimiento y seguridad.',
          ],
        },
      ],
    },
    {
      title: 'Contenido',
      pages: [
        {
          path: '/dashboard/admin/blog',
          title: 'Blog',
          bullets: [
            'Gestión de artículos del blog público: redacción, publicación y SEO básico desde el panel.',
          ],
        },
      ],
    },
  ],
}

/** English page copy keyed by route */
const enTenantPagesByPath: Record<string, GuidePageItem> = {
  '/dashboard': {
    path: '/dashboard',
    title: 'Dashboard',
    bullets: [
      'High-level KPIs: active operations, entries in the period, pending charges, registry expirations, warehouse snapshot, and entries by status.',
      'Use it daily to spot exceptions (payments, expirations, warehouse load).',
      'Quick paths into the modules you use most.',
    ],
  },
  '/dashboard/operations': {
    path: '/dashboard/operations',
    title: 'Operations',
    bullets: [
      'Operations list with search and filters by status and priority.',
      'Each operation covers end-to-end work with the client: documents, charges, tracking, and team coordination.',
      'Create new operations and open detail to view or edit.',
    ],
  },
  '/dashboard/clients': {
    path: '/dashboard/clients',
    title: 'Clients',
    bullets: [
      'Importer/client directory with contact and fiscal basics.',
      'Client profile: linked operations, addresses, contacts, and where permitted, statements or documents.',
      'Foundation for tying entries, orders, and billing to the right legal entity.',
    ],
  },
  '/dashboard/pedimentos': {
    path: '/dashboard/pedimentos',
    title: 'Customs entries',
    bullets: [
      'Import/export entries with filters and workflow status (draft, validated, paid, etc.).',
      'Create and edit entries, line-item detail, link to operations and clients.',
      'Central place to align filings with your internal process.',
    ],
  },
  '/dashboard/clasificacion': {
    path: '/dashboard/clasificacion',
    title: 'Tariff classification',
    bullets: [
      'TIGIE tools: search, legal notes, and support for correct tariff codes.',
      'Reduces risk of penalties or corrections from wrong classification.',
      'Often used with entries and document compliance rules.',
    ],
  },
  '/dashboard/inspecciones': {
    path: '/dashboard/inspecciones',
    title: 'Inspections',
    bullets: [
      'Track customs inspections/recognitions and status (e.g. traffic-light style).',
      'Coordinate the team when authorities delay or request more information.',
      'Linked to operations subject to physical review.',
    ],
  },
  '/dashboard/previos': {
    path: '/dashboard/previos',
    title: 'Previos',
    bullets: [
      'Manage merchandise “previo” steps before final clearance.',
      'Track by entry or reference with client and warehouse alignment.',
      'Helps meet timing and documentation requirements.',
    ],
  },
  '/dashboard/bodega': {
    path: '/dashboard/bodega',
    title: 'Warehouse',
    bullets: [
      'Inventory and stock by client, location, or reference depending on setup.',
      'Inbound/outbound movements tied to operations and entries when applicable.',
      'Operational control for bonded storage or in-custody goods.',
    ],
  },
  '/dashboard/tesoreria': {
    path: '/dashboard/tesoreria',
    title: 'Treasury',
    bullets: [
      'Client running balance: advances, payment applications, balances, and statements.',
      'Funds/accounts subflows as implemented in the product.',
      'Aligns cash with operations and paid entries.',
    ],
  },
  '/dashboard/padron': {
    path: '/dashboard/padron',
    title: 'Importer registry',
    bullets: [
      'Consult and monitor importer registry validity and key dates.',
      'IMMEX or other program routes when enabled.',
      'Expiry alerts to avoid filing with inactive RFC status.',
    ],
  },
  '/dashboard/reportes': {
    path: '/dashboard/reportes',
    title: 'Reports',
    bullets: [
      'Operational and executive reports: volumes, entries, merchandise, etc.',
      'Views or exports for leadership and internal compliance.',
      'Complements the main dashboard with time or client cuts.',
    ],
  },
  '/dashboard/conversiones': {
    path: '/dashboard/conversiones',
    title: 'Conversions',
    bullets: [
      'Unit converter and exchange-rate helpers for valuation and quoting.',
      'Support tool without leaving the app.',
    ],
  },
  '/dashboard/compliance/rule-sets': {
    path: '/dashboard/compliance/rule-sets',
    title: 'Compliance',
    bullets: [
      'Document compliance rule sets: which documents each operation type or client needs.',
      'Create and maintain rules; see compliance state on operations.',
      'Works with document categories to standardize file quality.',
    ],
  },
  '/dashboard/document-categories': {
    path: '/dashboard/document-categories',
    title: 'Document categories',
    bullets: [
      'Taxonomy of document types your org uses (contracts, invoices, letters, etc.).',
      'Organizes uploads and compliance across operations and entries.',
    ],
  },
  '/dashboard/ai': {
    path: '/dashboard/ai',
    title: 'AI copilot',
    bullets: [
      'Assistant for regulatory/tariff/procedural questions within configured scope.',
      'Structured answers to speed up research.',
      'Does not replace the broker’s judgment or official law; use as a helper.',
    ],
  },
  '/dashboard/integrations': {
    path: '/dashboard/integrations',
    title: 'Integrations',
    bullets: [
      'Connections to external systems (ERP, accounting, email, warehouse) when enabled.',
      'Credential and sync status management where applicable.',
    ],
  },
  '/dashboard/organizations': {
    path: '/dashboard/organizations',
    title: 'Organizations',
    bullets: [
      'Create and manage orgs when your account spans multiple legal entities or brands.',
      'Context for the org switcher in the header.',
    ],
  },
  '/dashboard/users': {
    path: '/dashboard/users',
    title: 'Users',
    bullets: [
      'Invite and manage tenant users: email, name, and membership.',
      'Deactivate or adjust access per internal policy.',
    ],
  },
  '/dashboard/roles': {
    path: '/dashboard/roles',
    title: 'Roles',
    bullets: [
      'Define roles and RBAC over modules and sensitive actions.',
      'Separate filing, treasury, admin, and read-only patterns.',
    ],
  },
  '/dashboard/audit-logs': {
    path: '/dashboard/audit-logs',
    title: 'Audit log',
    bullets: [
      'Tenant audit trail for traceability and compliance.',
      'Filter by user, resource, or date depending on product filters.',
    ],
  },
  '/dashboard/billing': {
    path: '/dashboard/billing',
    title: 'Billing',
    bullets: [
      'Subscription plan, payment method, and Aduvanta account status.',
      'Invoices or receipts per billing integration.',
    ],
  },
  '/dashboard/usage': {
    path: '/dashboard/usage',
    title: 'Usage',
    bullets: [
      'Plan consumption metrics (users, volume, or other limits per contract).',
      'Helps plan upgrades or license changes.',
    ],
  },
  '/dashboard/feature-flags': {
    path: '/dashboard/feature-flags',
    title: 'Feature flags',
    bullets: [
      'Gradual or experimental features enabled for your org only.',
      'Shown when your tenant admin has permission.',
    ],
  },
}

const enAdminPagesByPath: Record<string, GuidePageItem> = {
  '/dashboard/admin': {
    path: '/dashboard/admin',
    title: 'Super Admin panel',
    bullets: [
      'Global KPIs: orgs, users, recent activity, and shortcuts to other admin tools.',
      'Single pane for platform support and product leadership.',
    ],
  },
  '/dashboard/admin/health': {
    path: '/dashboard/admin/health',
    title: 'System status',
    bullets: [
      'Health of dependent services (API, database, queues, etc.) for infra diagnostics.',
      'Typically used by infrastructure or tier-2 support.',
    ],
  },
  '/dashboard/admin/pedimentos': {
    path: '/dashboard/admin/pedimentos',
    title: 'Entries (global)',
    bullets: [
      'Cross-tenant entry view for platform support or audits.',
      'Filters and detail to investigate issues without switching tenants for every case.',
    ],
  },
  '/dashboard/admin/operaciones': {
    path: '/dashboard/admin/operaciones',
    title: 'Operations (global)',
    bullets: ['Cross-tenant operations list for support and follow-up.'],
  },
  '/dashboard/admin/organizations': {
    path: '/dashboard/admin/organizations',
    title: 'Organizations',
    bullets: [
      'Tenant administration: creation, status, limits, and metadata per organization.',
    ],
  },
  '/dashboard/admin/uso': {
    path: '/dashboard/admin/uso',
    title: 'Usage by organization',
    bullets: ['Aggregated usage per customer for billing and plan tuning.'],
  },
  '/dashboard/admin/users': {
    path: '/dashboard/admin/users',
    title: 'Users (global)',
    bullets: ['Search and manage users across the platform for support and security.'],
  },
  '/dashboard/admin/sesiones': {
    path: '/dashboard/admin/sesiones',
    title: 'Active sessions',
    bullets: ['Inspect sessions or connected devices for security and support.'],
  },
  '/dashboard/admin/suscripciones': {
    path: '/dashboard/admin/suscripciones',
    title: 'Subscriptions',
    bullets: ['Subscription state aligned with Stripe or other billing providers.'],
  },
  '/dashboard/admin/anuncios': {
    path: '/dashboard/admin/anuncios',
    title: 'Announcements',
    bullets: ['Global banners (maintenance, news) shown in customer dashboards.'],
  },
  '/dashboard/admin/descuentos': {
    path: '/dashboard/admin/descuentos',
    title: 'Discounts',
    bullets: ['Promotional codes or campaigns applied to subscription billing.'],
  },
  '/dashboard/admin/feature-flags': {
    path: '/dashboard/admin/feature-flags',
    title: 'Feature flags (global)',
    bullets: ['Roll out features by tenant or percentage of users.'],
  },
  '/dashboard/admin/catalogos': {
    path: '/dashboard/admin/catalogos',
    title: 'SAT catalogs',
    bullets: ['Maintenance or sync of official catalogs consumed by the product (Annex 22 and related).'],
  },
  '/dashboard/admin/audit-logs': {
    path: '/dashboard/admin/audit-logs',
    title: 'Platform audit log',
    bullets: ['Sensitive platform-level actions for compliance and security.'],
  },
  '/dashboard/admin/blog': {
    path: '/dashboard/admin/blog',
    title: 'Blog',
    bullets: ['Manage public blog posts: authoring, publishing, and basic SEO from the dashboard.'],
  },
}

const EN_TENANT_GROUP_TITLE: Record<string, string> = {
  'Inicio y operación': 'Operations overview',
  Aduanas: 'Customs',
  Control: 'Control',
  Sistema: 'System',
  'Administración de la organización': 'Organization administration',
}

const EN_ADMIN_GROUP_TITLE: Record<string, string> = {
  'Resumen y salud': 'Overview & health',
  'Actividad cruzada': 'Cross-tenant activity',
  'Tenants y cobro': 'Tenants & billing',
  'Configuración de plataforma': 'Platform configuration',
  Contenido: 'Content',
}

const en: DashboardGuideContent = {
  metaTitle: 'Dashboard guide',
  metaDescription:
    'Overview of every Aduvanta dashboard area: operations, customs desk, control, system tools, and organization administration.',
  pageTitle: 'Dashboard guide',
  pageSubtitle: 'What each section does and what you can do there',
  intro:
    'Aduvanta brings your agency’s customs and foreign-trade work into one place: operations, entries, warehouse, finance, and platform governance. Use this page as a map of the sidebar.',
  permissionsNote:
    'Some screens depend on your role and permissions. If you don’t see a module or action, ask your organization administrator for access.',
  settingsNote:
    'Personal preferences and session settings (language, light/dark theme, profile) live under the gear icon at the bottom of the sidebar.',
  tenantSectionTitle: 'Your organization',
  adminSectionTitle: 'Super Admin — Platform',
  adminIntro:
    'These areas are only available if you are a system administrator. They manage all tenants, global usage, and platform configuration.',
  extraRoutesTitle: 'Other dashboard routes',
  extraRoutes: [
    {
      path: '/dashboard/imports',
      title: 'Imports',
      description:
        'Bulk data loads (files) into the platform, based on templates and permissions enabled for your org.',
    },
    {
      path: '/dashboard/exports',
      title: 'Exports',
      description: 'Bulk downloads for external analysis or operational backups.',
    },
  ],
  tenantGroups: es.tenantGroups.map((group) => ({
    title: EN_TENANT_GROUP_TITLE[group.title] ?? group.title,
    pages: group.pages.map((page) => enTenantPagesByPath[page.path] ?? page),
  })),
  adminGroups: es.adminGroups.map((group) => ({
    title: EN_ADMIN_GROUP_TITLE[group.title] ?? group.title,
    pages: group.pages.map((page) => enAdminPagesByPath[page.path] ?? page),
  })),
}

export const dashboardGuideByLocale: Record<GuideLocale, DashboardGuideContent> = {
  'es-MX': es,
  'en-US': en,
}

export const getDashboardGuide = (locale: string): DashboardGuideContent =>
  dashboardGuideByLocale[locale as GuideLocale] ?? dashboardGuideByLocale['en-US']
