import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Aduvanta — Software Aduanal para Mexico'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #03035e 0%, #1a1a6e 50%, #2d2d8a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 800,
              color: '#03035e',
            }}
          >
            A
          </div>
          <span
            style={{
              fontSize: '36px',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-0.5px',
            }}
          >
            Aduvanta
          </span>
        </div>

        <div
          style={{
            fontSize: '52px',
            fontWeight: 800,
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.15,
            letterSpacing: '-1px',
            maxWidth: '900px',
          }}
        >
          Software Aduanal 100% Web para Mexico
        </div>

        <div
          style={{
            fontSize: '22px',
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            marginTop: '24px',
            maxWidth: '700px',
            lineHeight: 1.5,
          }}
        >
          Pedimentos · TIGIE · Anexo 22 · Portal de Clientes · Facturacion · Auditoria
        </div>

        <div
          style={{
            display: 'flex',
            gap: '40px',
            marginTop: '48px',
          }}
        >
          {[
            { value: '14', label: 'modulos' },
            { value: '100%', label: 'en la nube' },
            { value: '0', label: 'instalacion' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: 'white',
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
