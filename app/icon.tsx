import { ImageResponse } from 'next/og';

// App icon generator for Next.js
// Generates favicon and app icons dynamically

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#1a1a1a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#60a5fa',
          fontWeight: 700,
        }}
      >
        S
      </div>
    ),
    {
      ...size,
    }
  );
}
