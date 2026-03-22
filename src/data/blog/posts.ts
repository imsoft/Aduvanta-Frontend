type BlogPost = {
  slug: string
  title: { 'en-US': string; 'es-MX': string }
  description: { 'en-US': string; 'es-MX': string }
  content: { 'en-US': string; 'es-MX': string }
  date: string
  author: string
  keywords: { 'en-US': string; 'es-MX': string }
  readingTime: number
}

const posts: BlogPost[] = [
  {
    slug: 'que-es-un-pedimento-aduanal',
    title: {
      'es-MX':
        'Que es un Pedimento Aduanal y Por Que es Clave en Comercio Exterior',
      'en-US':
        'What Is a Pedimento (Customs Declaration) and Why It Matters in Foreign Trade',
    },
    description: {
      'es-MX':
        'Conoce la estructura del pedimento aduanal, sus campos clave y por que es el documento central de toda operacion de comercio exterior en Mexico.',
      'en-US':
        'Learn about the structure of the Mexican customs declaration (pedimento), its key fields, and why it is the central document in every foreign trade operation.',
    },
    content: {
      'es-MX': `El pedimento aduanal es el documento oficial que ampara la entrada o salida de mercancias del territorio nacional mexicano. Emitido ante el Servicio de Administracion Tributaria (SAT), el pedimento registra toda la informacion fiscal, arancelaria y logistica de una operacion de comercio exterior. Sin un pedimento correctamente llenado y validado, las mercancias no pueden ser despachadas legalmente por la aduana.

La estructura del pedimento esta definida en el Anexo 22 de las Reglas Generales de Comercio Exterior. Incluye campos como el numero de pedimento, la clave de aduana, el tipo de operacion (importacion, exportacion, transito), los datos del importador o exportador, el agente o agencia aduanal, y el detalle de cada partida de mercancias con su fraccion arancelaria, valor, origen y regulaciones aplicables. Cada campo tiene un formato estricto y debe coincidir con los catalogos oficiales del SAT.

Uno de los aspectos mas criticos del pedimento es la clasificacion arancelaria de cada mercancia, basada en la Tarifa de la Ley de los Impuestos Generales de Importacion y Exportacion (TIGIE). Una fraccion arancelaria incorrecta puede resultar en el pago incorrecto de impuestos, multas significativas, e incluso la retencion de la mercancia en la aduana. Por eso, la precision en la captura del pedimento es fundamental para cualquier agencia aduanal.

Ademas del aspecto fiscal, el pedimento es un documento con efectos legales que puede ser auditado por las autoridades hasta cinco anos despues de su emision. Mantener un archivo organizado y accesible de todos los pedimentos es una obligacion legal y una necesidad operativa. Las agencias que dependen de archivos en papel o sistemas desconectados enfrentan riesgos importantes ante cualquier revision de la autoridad.

Un software aduanal moderno permite capturar el pedimento con validaciones automaticas contra los catalogos del Anexo 22, calcular los impuestos y contribuciones en tiempo real, y generar el archivo electronico para su transmision al sistema SAAI del SAT. Esto reduce errores, acelera el despacho y da trazabilidad completa a cada operacion.`,
      'en-US': `The pedimento is the official document that covers the entry or exit of goods from Mexican national territory. Filed before the Tax Administration Service (SAT), the pedimento records all fiscal, tariff, and logistical information for a foreign trade operation. Without a correctly completed and validated pedimento, goods cannot be legally cleared through customs.

The structure of the pedimento is defined in Annex 22 of the General Foreign Trade Rules. It includes fields such as the pedimento number, customs office code, type of operation (import, export, transit), importer or exporter data, the customs agent or agency, and the detail of each line item with its tariff classification, value, origin, and applicable regulations. Each field has a strict format and must match the official SAT catalogs.

One of the most critical aspects of the pedimento is the tariff classification of each product, based on the General Import and Export Tax Law Tariff (TIGIE). An incorrect tariff fraction can result in incorrect tax payments, significant fines, and even the seizure of goods at customs. This is why accuracy in pedimento preparation is fundamental for any customs agency.

Beyond the fiscal aspect, the pedimento is a legally binding document that can be audited by authorities up to five years after issuance. Maintaining an organized and accessible archive of all pedimentos is both a legal obligation and an operational necessity. Agencies that rely on paper files or disconnected systems face significant risks during any government audit.

Modern customs software allows you to prepare the pedimento with automatic validations against the Annex 22 catalogs, calculate taxes and duties in real time, and generate the electronic file for transmission to the SAT's SAAI system. This reduces errors, speeds up clearance, and provides full traceability for every operation.`,
    },
    date: '2026-03-01',
    author: 'Aduvanta',
    keywords: {
      'es-MX':
        'pedimento aduanal, que es un pedimento, comercio exterior Mexico, Anexo 22, despacho aduanero, SAT, SAAI',
      'en-US':
        'pedimento, customs declaration Mexico, foreign trade, Annex 22, customs clearance, SAT, SAAI',
    },
    readingTime: 5,
  },
  {
    slug: 'clasificacion-arancelaria-tigie-guia',
    title: {
      'es-MX': 'Guia Practica de Clasificacion Arancelaria con la TIGIE',
      'en-US':
        'Practical Guide to Tariff Classification Using the TIGIE',
    },
    description: {
      'es-MX':
        'Aprende como encontrar la fraccion arancelaria correcta en la TIGIE, evitar errores comunes y por que una clasificacion precisa protege tus operaciones.',
      'en-US':
        'Learn how to find the correct tariff fraction in the TIGIE, avoid common mistakes, and why accurate classification protects your operations.',
    },
    content: {
      'es-MX': `La clasificacion arancelaria es el proceso de asignar a cada mercancia un codigo numerico de la Tarifa de la Ley de los Impuestos Generales de Importacion y Exportacion (TIGIE). Este codigo, conocido como fraccion arancelaria, determina los aranceles, impuestos, regulaciones y restricciones no arancelarias que aplican a la mercancia. En Mexico, la TIGIE esta basada en el Sistema Armonizado de la Organizacion Mundial de Aduanas y se compone de 22 secciones y 98 capitulos.

El proceso de clasificacion comienza con la identificacion precisa de la mercancia: su composicion, funcion, uso, proceso de manufactura y presentacion. Las Reglas Generales de Interpretacion del Sistema Armonizado establecen la jerarquia logica para determinar la fraccion correcta. La regla mas importante es que la clasificacion se determina por el texto de las partidas y las notas de seccion o capitulo, no por la descripcion comercial del producto.

Los errores mas comunes en clasificacion arancelaria incluyen clasificar por uso comercial en lugar de composicion o funcion, no consultar las notas legales de seccion y capitulo, confundir fracciones con aranceles similares pero aplicaciones distintas, y no verificar si existen criterios de clasificacion emitidos por el SAT. Un error de clasificacion puede resultar en el pago incorrecto de aranceles, la aplicacion de regulaciones incorrectas, multas que van del 70% al 100% de los impuestos omitidos, e incluso procedimientos administrativos.

Para evitar estos errores, es fundamental contar con acceso actualizado a la TIGIE y sus notas explicativas, consultar los criterios de clasificacion publicados por el SAT, y documentar el razonamiento detras de cada clasificacion. Las agencias aduanales profesionales mantienen una base de datos interna de clasificaciones previas para garantizar consistencia y rapidez en la operacion.

Un sistema de clasificacion arancelaria digital permite buscar fracciones por palabra clave, filtrar por seccion o capitulo, ver el historico de aranceles y regulaciones, y vincular cada clasificacion directamente al pedimento. Esto no solo ahorra tiempo, sino que crea un registro auditable que protege a la agencia ante revisiones futuras.`,
      'en-US': `Tariff classification is the process of assigning each product a numerical code from the General Import and Export Tax Law Tariff (TIGIE). This code, known as the tariff fraction, determines the duties, taxes, regulations, and non-tariff restrictions that apply to the product. In Mexico, the TIGIE is based on the World Customs Organization's Harmonized System and is organized into 22 sections and 98 chapters.

The classification process begins with the precise identification of the product: its composition, function, use, manufacturing process, and presentation. The General Rules of Interpretation of the Harmonized System establish the logical hierarchy for determining the correct fraction. The most important rule is that classification is determined by the text of the headings and the section or chapter notes, not by the commercial description of the product.

The most common mistakes in tariff classification include classifying by commercial use instead of composition or function, not consulting the legal notes of sections and chapters, confusing fractions with similar duties but different applications, and not checking whether the SAT has issued classification criteria. A classification error can result in incorrect duty payments, application of wrong regulations, fines ranging from 70% to 100% of omitted taxes, and even administrative proceedings.

To avoid these errors, it is essential to have up-to-date access to the TIGIE and its explanatory notes, consult the classification criteria published by the SAT, and document the reasoning behind each classification. Professional customs agencies maintain an internal database of previous classifications to ensure consistency and speed in operations.

A digital tariff classification system allows you to search fractions by keyword, filter by section or chapter, view the history of duties and regulations, and link each classification directly to the pedimento. This not only saves time but creates an auditable record that protects the agency during future reviews.`,
    },
    date: '2026-03-10',
    author: 'Aduvanta',
    keywords: {
      'es-MX':
        'clasificacion arancelaria, TIGIE, fraccion arancelaria, Sistema Armonizado, comercio exterior, SAT, aranceles Mexico',
      'en-US':
        'tariff classification, TIGIE, tariff fraction, Harmonized System, foreign trade, SAT, Mexico duties',
    },
    readingTime: 5,
  },
  {
    slug: 'software-aduanal-vs-excel',
    title: {
      'es-MX':
        'Por Que las Agencias Aduanales Deben Dejar Excel y Adoptar Software Especializado',
      'en-US':
        'Why Customs Agencies Should Move Beyond Excel and Adopt Specialized Software',
    },
    description: {
      'es-MX':
        'Descubre por que los procesos manuales y las hojas de calculo ponen en riesgo a tu agencia aduanal, y como el software especializado resuelve esos problemas.',
      'en-US':
        'Discover why manual processes and spreadsheets put your customs agency at risk, and how specialized software solves those problems.',
    },
    content: {
      'es-MX': `Muchas agencias aduanales en Mexico todavia operan con una combinacion de hojas de calculo en Excel, documentos en Word, correos electronicos y archivos fisicos. Aunque estas herramientas fueron utiles en su momento, hoy representan un riesgo operativo, fiscal y legal significativo. El volumen de operaciones, la complejidad regulatoria y las exigencias de trazabilidad del SAT hacen que los procesos manuales sean insostenibles a mediano plazo.

El principal problema de Excel es que no fue disenado para manejar flujos de trabajo complejos con multiples usuarios, permisos y validaciones. Una hoja de calculo no valida automaticamente que una fraccion arancelaria exista en la TIGIE vigente, no calcula contribuciones con reglas actualizadas, no controla quien modifico un dato ni cuando, y no genera los archivos electronicos que requiere el sistema SAAI. Cada una de estas deficiencias se traduce en errores que cuestan tiempo y dinero.

El riesgo fiscal es particularmente grave. Un error de captura en Excel puede pasar desapercibido durante meses y solo detectarse durante una auditoria del SAT. Las multas por diferencias en clasificacion arancelaria, valor declarado o datos del pedimento pueden superar el valor de la propia mercancia. Sin un sistema que valide en tiempo real, cada pedimento capturado manualmente es una apuesta.

El software aduanal especializado resuelve estos problemas de raiz. Centraliza toda la informacion de operaciones, clientes, pedimentos y documentos en una sola plataforma. Aplica validaciones automaticas contra los catalogos oficiales del SAT. Mantiene un registro de auditoria de cada cambio. Permite que multiples usuarios trabajen simultaneamente con permisos controlados. Y genera reportes e indicadores que permiten tomar decisiones informadas sobre la operacion.

La transicion de Excel a un software aduanal no es solo una mejora tecnologica: es una decision de negocio que reduce riesgos, mejora la eficiencia y posiciona a la agencia para crecer. Las agencias que adoptan tecnologia moderna pueden atender mas clientes con menos errores, responder mas rapido ante la autoridad y ofrecer un nivel de servicio que sus competidores manuales simplemente no pueden igualar.`,
      'en-US': `Many customs agencies in Mexico still operate with a combination of Excel spreadsheets, Word documents, emails, and physical files. While these tools were useful at one point, they now represent a significant operational, fiscal, and legal risk. The volume of operations, regulatory complexity, and traceability requirements from the SAT make manual processes unsustainable in the medium term.

The main problem with Excel is that it was not designed to handle complex workflows with multiple users, permissions, and validations. A spreadsheet does not automatically validate that a tariff fraction exists in the current TIGIE, does not calculate duties with updated rules, does not track who modified a data point or when, and does not generate the electronic files required by the SAAI system. Each of these deficiencies translates into errors that cost time and money.

The fiscal risk is particularly serious. A data entry error in Excel can go unnoticed for months and only be detected during a SAT audit. Fines for discrepancies in tariff classification, declared value, or pedimento data can exceed the value of the goods themselves. Without a system that validates in real time, every manually prepared pedimento is a gamble.

Specialized customs software solves these problems at the root. It centralizes all information about operations, clients, pedimentos, and documents in a single platform. It applies automatic validations against the official SAT catalogs. It maintains an audit trail of every change. It allows multiple users to work simultaneously with controlled permissions. And it generates reports and indicators that enable informed decisions about operations.

The transition from Excel to customs software is not just a technology upgrade: it is a business decision that reduces risk, improves efficiency, and positions the agency for growth. Agencies that adopt modern technology can serve more clients with fewer errors, respond faster to government inquiries, and offer a level of service that their manual competitors simply cannot match.`,
    },
    date: '2026-03-18',
    author: 'Aduvanta',
    keywords: {
      'es-MX':
        'software aduanal, Excel vs software, agencia aduanal, automatizacion aduanera, sistema aduanero, software para pedimentos',
      'en-US':
        'customs software, Excel vs software, customs agency, customs automation, customs system, pedimentos software',
    },
    readingTime: 5,
  },
]

function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug)
}

function getAllPosts(): BlogPost[] {
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export { posts, getPostBySlug, getAllPosts }
export type { BlogPost }
