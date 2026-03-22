import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Softmaxxer - Evidence-Based Skincare'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 72,
          background: '#1a1a1a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#60a5fa',
          fontWeight: 700,
        }}
      >
        <div>Softmaxxer</div>
        <div style={{ fontSize: 28, color: '#9ca3af', marginTop: 24 }}>
          Evidence-Based Skincare Routine Optimization
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
