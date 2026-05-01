import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') ?? '문화강국 공식 아카이브 (VQCP)';
    const type = searchParams.get('type') ?? 'FACT CHECK';
    
    // Limits title length to prevent line breaks destroying the layout deeply
    const safeTitle = title.length > 55 ? title.slice(0, 55) + '...' : title;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: type === 'FACT CHECK' ? '#0f172a' : '#faf9f6',
            color: type === 'FACT CHECK' ? '#ffffff' : '#0f172a',
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Top Stamp / Label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: type === 'FACT CHECK' ? '#e11d48' : '#4f46e5',
              padding: '12px 24px',
              borderRadius: '999px',
              fontWeight: 900,
              fontSize: '24px',
              letterSpacing: '0.1em',
              color: 'white',
              border: type === 'FACT CHECK' ? 'none' : '1px solid #c7d2fe',
            }}
          >
            {type === 'FACT CHECK' ? '🚨 공식 팩트체크' : '📖 국가전략노트 (The Canon)'}
          </div>

          {/* Main Title (Zero Click Strategy) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: '40px',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                fontSize: '64px',
                fontWeight: 900,
                lineHeight: 1.3,
                letterSpacing: '-0.02em',
                // Using flex wrap simulation
                display: 'flex',
                flexWrap: 'wrap',
                whiteSpace: 'pre-wrap',
                maxWidth: '1000px',
              }}
            >
              {safeTitle}
            </div>
            
            {type === 'FACT CHECK' && (
              <div
                style={{
                  fontSize: '32px',
                  color: '#94a3b8',
                  marginTop: '20px',
                  fontWeight: 500,
                }}
              >
                잘못된 허위 프레임입니다. 공식 해명과 데이터를 확인하세요.
              </div>
            )}
          </div>

          {/* Footer Branding */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: type === 'FACT CHECK' ? '2px solid #1e293b' : '2px solid #e2e8f0',
              paddingTop: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#2563eb', borderRadius: '8px' }}></div>
              <span style={{ fontSize: '28px', fontWeight: 800 }}>VQCP Statesman</span>
            </div>
            <div style={{ fontSize: '24px', color: type === 'FACT CHECK' ? '#64748b' : '#94a3b8', fontWeight: 500 }}>
              phalanx.co
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
