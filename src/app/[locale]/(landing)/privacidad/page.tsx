import type { Metadata } from 'next'
import { buildPageMetadata, buildBreadcrumbJsonLd, BASE_URL } from '@/lib/seo'
import { Link } from '@/i18n/navigation'

const content = {
  'en-US': {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: March 1, 2026',
    intro:
      'Aduvanta Technologies, S.A.P.I. de C.V. ("Aduvanta", "we", "us", or "our") is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and share your personal information when you use our cloud-based customs software platform ("the Service"), in compliance with Mexico\'s Federal Law on Protection of Personal Data Held by Private Parties (Ley Federal de Proteccion de Datos Personales en Posesion de los Particulares, "LFPDPPP") and its Regulations.',
    sections: [
      {
        heading: 'Data Controller',
        body: 'Aduvanta Technologies, S.A.P.I. de C.V., with registered address at Monterrey, Nuevo Leon, Mexico, is the data controller responsible for collecting, using, and protecting your personal data. For any inquiries regarding this Privacy Policy, you may contact our Data Protection Officer at privacy@aduvanta.com.',
      },
      {
        heading: 'Personal Data We Collect',
        body: 'We collect the following categories of personal data:\n\n• Identification data: Full name, email address, phone number, tax identification number (RFC), and CURP when applicable.\n• Account data: Username, encrypted password, organization membership, role assignments, and permissions.\n• Billing data: Company name, tax address, payment method details (processed through certified third-party payment processors), and invoicing information.\n• Usage data: IP address, browser type, device information, access timestamps, pages visited, and features used within the platform.\n• Operational data: Customs declarations (pedimentos), tariff classifications, client records, and other information you input into the platform as part of your customs operations.\n• Communications data: Support tickets, emails, and chat transcripts when you contact our support team.',
      },
      {
        heading: 'Purpose of Data Collection',
        body: 'We process your personal data for the following purposes:\n\n• Providing and maintaining the Service, including account creation, authentication, and authorization.\n• Processing payments, issuing invoices, and managing your subscription.\n• Sending transactional communications such as account confirmations, security alerts, and service updates.\n• Providing technical support and responding to your inquiries.\n• Improving the Service through anonymized usage analytics.\n• Complying with legal and regulatory obligations, including tax reporting and audit requirements.\n• Enforcing our Terms of Service and protecting the security of the platform.\n\nWe will not use your personal data for purposes incompatible with those stated above without your prior consent.',
      },
      {
        heading: 'Legal Basis for Processing',
        body: 'We process your personal data based on the following legal grounds under the LFPDPPP:\n\n• Contractual necessity: Processing required to fulfill our contractual obligations when you subscribe to and use the Service.\n• Legal obligations: Processing required to comply with applicable Mexican laws, including tax, accounting, and customs regulations.\n• Legitimate interest: Processing necessary for the security, improvement, and proper functioning of the Service.\n• Consent: For optional processing activities such as marketing communications, which you may opt into or out of at any time.',
      },
      {
        heading: 'Data Storage and Security',
        body: 'Your personal data is stored on secure servers provided by trusted infrastructure partners with data centers that comply with industry-standard certifications (SOC 2, ISO 27001). We implement the following security measures:\n\n• Encryption of data at rest and in transit using TLS 1.3 and AES-256.\n• Role-based access control (RBAC) ensuring that only authorized personnel can access specific data.\n• Multi-tenant data isolation ensuring that each organization\'s data is logically separated.\n• Automated daily backups with point-in-time recovery capabilities.\n• Comprehensive audit logging of all access and modifications to sensitive data.\n• Regular security assessments and vulnerability testing.\n\nWhile we employ industry-standard security practices, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security but commit to promptly notifying affected users in the event of a data breach, in accordance with the LFPDPPP.',
      },
      {
        heading: 'Data Sharing and Third Parties',
        body: 'We may share your personal data with the following categories of third parties, solely to the extent necessary for the purposes described in this Privacy Policy:\n\n• Infrastructure providers: Cloud hosting, database, and storage services for platform operation.\n• Payment processors: Certified payment service providers for subscription billing.\n• Analytics services: Anonymized usage data for service improvement (no personally identifiable information is shared).\n• Legal and regulatory authorities: When required by law, court order, or government regulation.\n• Professional advisors: Auditors, lawyers, and accountants as necessary for business operations.\n\nWe do not sell, rent, or trade your personal data to third parties for marketing purposes. All third-party service providers are contractually bound to maintain the confidentiality and security of your data.',
      },
      {
        heading: 'Cookies and Tracking Technologies',
        body: 'We use cookies and similar technologies for the following purposes:\n\n• Essential cookies: Required for authentication, session management, and security. These cannot be disabled.\n• Functional cookies: Remember your preferences such as language selection and interface settings.\n• Analytics cookies: Help us understand how users interact with the platform to improve the Service.\n\nYou can manage cookie preferences through your browser settings. Disabling essential cookies may prevent you from using the Service.',
      },
      {
        heading: 'Your Rights Under the LFPDPPP (ARCO Rights)',
        body: 'Under the LFPDPPP, you have the following rights regarding your personal data (known as ARCO rights):\n\n• Access (Acceso): You may request access to the personal data we hold about you.\n• Rectification (Rectificacion): You may request correction of inaccurate or incomplete personal data.\n• Cancellation (Cancelacion): You may request deletion of your personal data when it is no longer necessary for the purposes for which it was collected.\n• Opposition (Oposicion): You may object to the processing of your personal data for specific purposes.\n\nTo exercise your ARCO rights, please send a written request to privacy@aduvanta.com including your full name, a copy of your official identification, a clear description of the data and the right you wish to exercise, and any supporting documentation. We will respond to your request within 20 business days, as required by the LFPDPPP.',
      },
      {
        heading: 'Data Retention',
        body: 'We retain your personal data for as long as your account is active or as needed to provide the Service. After account termination, we retain certain data for the following periods:\n\n• Billing and tax records: 5 years, as required by Mexican tax law.\n• Audit logs: 5 years, for compliance and dispute resolution purposes.\n• Anonymized usage data: Indefinitely, as it cannot be linked to individual users.\n\nUpon expiration of the applicable retention period, your data will be securely deleted or anonymized.',
      },
      {
        heading: 'International Data Transfers',
        body: 'Your personal data may be processed on servers located outside of Mexico. In such cases, we ensure that appropriate safeguards are in place, including contractual clauses that require the receiving party to maintain equivalent data protection standards in accordance with the LFPDPPP and its Regulations.',
      },
      {
        heading: 'Changes to This Privacy Policy',
        body: 'We may update this Privacy Policy from time to time. Significant changes will be communicated through the platform or via email. Your continued use of the Service after such changes constitutes acceptance of the updated Privacy Policy. We encourage you to review this page periodically.',
      },
      {
        heading: 'Contact Information',
        body: 'If you have questions about this Privacy Policy or wish to exercise your ARCO rights, please contact us at:\n\nAduvanta Technologies, S.A.P.I. de C.V.\nEmail: privacy@aduvanta.com\nWebsite: https://aduvanta.com\n\nYou also have the right to file a complaint with Mexico\'s National Institute for Transparency, Access to Information, and Personal Data Protection (INAI) if you believe your data protection rights have been violated.',
      },
    ],
  },
  'es-MX': {
    title: 'Aviso de Privacidad',
    lastUpdated: 'Ultima actualizacion: 1 de marzo de 2026',
    intro:
      'Aduvanta Technologies, S.A.P.I. de C.V. ("Aduvanta", "nosotros" o "nuestro") se compromete a proteger sus datos personales. El presente Aviso de Privacidad explica como recopilamos, usamos, almacenamos y compartimos su informacion personal cuando utiliza nuestra plataforma de software aduanal en la nube ("el Servicio"), en cumplimiento con la Ley Federal de Proteccion de Datos Personales en Posesion de los Particulares ("LFPDPPP") y su Reglamento.',
    sections: [
      {
        heading: 'Responsable del Tratamiento',
        body: 'Aduvanta Technologies, S.A.P.I. de C.V., con domicilio en Monterrey, Nuevo Leon, Mexico, es el responsable de la recopilacion, uso y proteccion de sus datos personales. Para cualquier consulta relacionada con este Aviso de Privacidad, puede contactar a nuestro Oficial de Proteccion de Datos en privacy@aduvanta.com.',
      },
      {
        heading: 'Datos Personales que Recopilamos',
        body: 'Recopilamos las siguientes categorias de datos personales:\n\n• Datos de identificacion: Nombre completo, direccion de correo electronico, numero de telefono, Registro Federal de Contribuyentes (RFC) y CURP cuando aplique.\n• Datos de cuenta: Nombre de usuario, contrasena cifrada, membresia organizacional, asignacion de roles y permisos.\n• Datos de facturacion: Razon social, domicilio fiscal, datos del metodo de pago (procesados a traves de proveedores de pago certificados) e informacion de facturacion.\n• Datos de uso: Direccion IP, tipo de navegador, informacion del dispositivo, marcas de tiempo de acceso, paginas visitadas y funcionalidades utilizadas dentro de la plataforma.\n• Datos operativos: Declaraciones aduaneras (pedimentos), clasificaciones arancelarias, registros de clientes y demas informacion que ingrese en la plataforma como parte de sus operaciones aduanales.\n• Datos de comunicaciones: Tickets de soporte, correos electronicos y transcripciones de chat cuando contacta a nuestro equipo de soporte.',
      },
      {
        heading: 'Finalidades del Tratamiento',
        body: 'Tratamos sus datos personales para las siguientes finalidades:\n\n• Proporcionar y mantener el Servicio, incluyendo la creacion de cuentas, autenticacion y autorizacion.\n• Procesar pagos, emitir facturas y gestionar su suscripcion.\n• Enviar comunicaciones transaccionales como confirmaciones de cuenta, alertas de seguridad y actualizaciones del servicio.\n• Brindar soporte tecnico y responder a sus consultas.\n• Mejorar el Servicio a traves de analiticas de uso anonimizadas.\n• Cumplir con obligaciones legales y regulatorias, incluyendo reportes fiscales y requisitos de auditoria.\n• Hacer cumplir nuestros Terminos y Condiciones y proteger la seguridad de la plataforma.\n\nNo utilizaremos sus datos personales para finalidades incompatibles con las aqui establecidas sin su consentimiento previo.',
      },
      {
        heading: 'Fundamento Legal del Tratamiento',
        body: 'Tratamos sus datos personales con base en los siguientes fundamentos legales conforme a la LFPDPPP:\n\n• Relacion contractual: Tratamiento necesario para cumplir con nuestras obligaciones contractuales cuando se suscribe y utiliza el Servicio.\n• Obligaciones legales: Tratamiento requerido para cumplir con leyes mexicanas aplicables, incluyendo regulaciones fiscales, contables y aduaneras.\n• Interes legitimo: Tratamiento necesario para la seguridad, mejora y correcto funcionamiento del Servicio.\n• Consentimiento: Para actividades de tratamiento opcionales como comunicaciones de marketing, a las cuales puede otorgar o revocar su consentimiento en cualquier momento.',
      },
      {
        heading: 'Almacenamiento y Seguridad de los Datos',
        body: 'Sus datos personales se almacenan en servidores seguros proporcionados por socios de infraestructura confiables con centros de datos que cumplen con certificaciones estandar de la industria (SOC 2, ISO 27001). Implementamos las siguientes medidas de seguridad:\n\n• Cifrado de datos en reposo y en transito usando TLS 1.3 y AES-256.\n• Control de acceso basado en roles (RBAC) que asegura que solo el personal autorizado pueda acceder a datos especificos.\n• Aislamiento de datos multi-inquilino que garantiza que los datos de cada organizacion esten logicamente separados.\n• Respaldos automaticos diarios con capacidad de recuperacion a un punto en el tiempo.\n• Registro de auditoria completo de todos los accesos y modificaciones a datos sensibles.\n• Evaluaciones de seguridad y pruebas de vulnerabilidad periodicas.\n\nAunque empleamos practicas de seguridad estandar de la industria, ningun metodo de transmision o almacenamiento electronico es 100% seguro. No podemos garantizar seguridad absoluta, pero nos comprometemos a notificar oportunamente a los usuarios afectados en caso de una violacion de datos, conforme a la LFPDPPP.',
      },
      {
        heading: 'Transferencias y Terceros',
        body: 'Podemos compartir sus datos personales con las siguientes categorias de terceros, unicamente en la medida necesaria para las finalidades descritas en este Aviso de Privacidad:\n\n• Proveedores de infraestructura: Servicios de alojamiento en la nube, bases de datos y almacenamiento para la operacion de la plataforma.\n• Procesadores de pago: Proveedores de servicios de pago certificados para la facturacion de suscripciones.\n• Servicios de analitica: Datos de uso anonimizados para la mejora del servicio (no se comparte informacion de identificacion personal).\n• Autoridades legales y regulatorias: Cuando lo requiera la ley, una orden judicial o regulacion gubernamental.\n• Asesores profesionales: Auditores, abogados y contadores segun sea necesario para las operaciones del negocio.\n\nNo vendemos, alquilamos ni comercializamos sus datos personales a terceros con fines de marketing. Todos los proveedores de servicios externos estan contractualmente obligados a mantener la confidencialidad y seguridad de sus datos.',
      },
      {
        heading: 'Cookies y Tecnologias de Rastreo',
        body: 'Utilizamos cookies y tecnologias similares para las siguientes finalidades:\n\n• Cookies esenciales: Necesarias para la autenticacion, gestion de sesiones y seguridad. No pueden desactivarse.\n• Cookies funcionales: Recuerdan sus preferencias como la seleccion de idioma y configuracion de la interfaz.\n• Cookies de analitica: Nos ayudan a entender como los usuarios interactuan con la plataforma para mejorar el Servicio.\n\nPuede gestionar las preferencias de cookies a traves de la configuracion de su navegador. Desactivar las cookies esenciales puede impedir el uso del Servicio.',
      },
      {
        heading: 'Sus Derechos ARCO',
        body: 'Conforme a la LFPDPPP, usted tiene los siguientes derechos respecto a sus datos personales (conocidos como derechos ARCO):\n\n• Acceso: Puede solicitar acceso a los datos personales que tenemos sobre usted.\n• Rectificacion: Puede solicitar la correccion de datos personales inexactos o incompletos.\n• Cancelacion: Puede solicitar la eliminacion de sus datos personales cuando ya no sean necesarios para las finalidades para las que fueron recopilados.\n• Oposicion: Puede oponerse al tratamiento de sus datos personales para finalidades especificas.\n\nPara ejercer sus derechos ARCO, envie una solicitud por escrito a privacy@aduvanta.com incluyendo su nombre completo, una copia de su identificacion oficial, una descripcion clara de los datos y el derecho que desea ejercer, y cualquier documentacion de soporte. Responderemos a su solicitud dentro de 20 dias habiles, conforme lo requiere la LFPDPPP.',
      },
      {
        heading: 'Conservacion de Datos',
        body: 'Conservamos sus datos personales mientras su cuenta este activa o sea necesario para proporcionar el Servicio. Despues de la terminacion de la cuenta, conservamos ciertos datos durante los siguientes periodos:\n\n• Registros de facturacion y fiscales: 5 anos, conforme lo requiere la legislacion fiscal mexicana.\n• Registros de auditoria: 5 anos, para fines de cumplimiento y resolucion de controversias.\n• Datos de uso anonimizados: Indefinidamente, ya que no pueden vincularse a usuarios individuales.\n\nAl vencimiento del periodo de conservacion aplicable, sus datos seran eliminados de forma segura o anonimizados.',
      },
      {
        heading: 'Transferencias Internacionales de Datos',
        body: 'Sus datos personales pueden ser procesados en servidores ubicados fuera de Mexico. En tales casos, nos aseguramos de que existan salvaguardas apropiadas, incluyendo clausulas contractuales que requieren que la parte receptora mantenga estandares de proteccion de datos equivalentes conforme a la LFPDPPP y su Reglamento.',
      },
      {
        heading: 'Cambios a este Aviso de Privacidad',
        body: 'Podemos actualizar este Aviso de Privacidad de tiempo en tiempo. Los cambios significativos seran comunicados a traves de la plataforma o por correo electronico. Su uso continuado del Servicio despues de dichos cambios constituye la aceptacion del Aviso de Privacidad actualizado. Le recomendamos revisar esta pagina periodicamente.',
      },
      {
        heading: 'Informacion de Contacto',
        body: 'Si tiene preguntas sobre este Aviso de Privacidad o desea ejercer sus derechos ARCO, contactenos en:\n\nAduvanta Technologies, S.A.P.I. de C.V.\nCorreo electronico: privacy@aduvanta.com\nSitio web: https://aduvanta.com\n\nTambien tiene derecho a presentar una queja ante el Instituto Nacional de Transparencia, Acceso a la Informacion y Proteccion de Datos Personales (INAI) si considera que sus derechos de proteccion de datos han sido vulnerados.',
      },
    ],
  },
} as const

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEs = locale === 'es-MX'
  return buildPageMetadata({
    locale,
    title: isEs ? 'Aviso de Privacidad' : 'Privacy Policy',
    description: isEs
      ? 'Aviso de Privacidad de Aduvanta. Conoce como recopilamos, usamos y protegemos tus datos personales conforme a la LFPDPPP.'
      : 'Aduvanta Privacy Policy. Learn how we collect, use, and protect your personal data in compliance with Mexican data protection law (LFPDPPP).',
    path: '/privacidad',
  })
}

export default async function PrivacidadPage({ params }: Props) {
  const { locale } = await params
  const t = locale === 'es-MX' ? content['es-MX'] : content['en-US']
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Aduvanta', url: `${BASE_URL}/${locale}` },
    { name: t.title, url: `${BASE_URL}/${locale}/privacidad` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.lastUpdated}</p>
        <p className="mt-6 leading-relaxed text-muted-foreground">{t.intro}</p>

        {t.sections.map((section) => (
          <div key={section.heading} className="mt-10">
            <h2 className="text-xl font-semibold">{section.heading}</h2>
            <div className="mt-3 space-y-4 leading-relaxed text-muted-foreground">
              {section.body.split('\n\n').map((paragraph, i) => (
                <p key={i} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-16 border-t pt-8">
          <p className="text-sm text-muted-foreground">
            {locale === 'es-MX' ? (
              <>
                Tambien puedes consultar nuestros{' '}
                <Link
                  href="/terminos"
                  className="underline hover:text-foreground"
                >
                  Terminos y Condiciones
                </Link>
                .
              </>
            ) : (
              <>
                You may also review our{' '}
                <Link
                  href="/terminos"
                  className="underline hover:text-foreground"
                >
                  Terms of Service
                </Link>
                .
              </>
            )}
          </p>
        </div>
      </section>
    </>
  )
}
