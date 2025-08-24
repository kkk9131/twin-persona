import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

// フォントの読み込み
const fontPromise = fetch(
  new URL('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap', import.meta.url)
).then((res) => res.text());

export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // URLパラメータから診断結果を取得
    const mbti = searchParams.get('mbti') || 'ENTP';
    const mbtiName = searchParams.get('mbtiName') || '討論者';
    const characterCode = searchParams.get('characterCode') || 'NIMC';
    const characterName = searchParams.get('characterName') || '天使のような純粋さ';
    const topScore = searchParams.get('topScore') || 'モテ度';
    const topScoreValue = searchParams.get('topScoreValue') || '97';
    const compatibility = searchParams.get('compatibility') || 'INFJ';
    const characterImage = searchParams.get('characterImage') || '';

    // カラーパレット定義
    const colors = {
      background: '#0a0e27',
      card: '#1a1f3a',
      primary: '#8B5CF6',
      secondary: '#06B6D4',
      accent: '#F59E0B',
      text: '#e2e8f0',
      textDim: '#94a3b8',
    };

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: colors.background,
            backgroundImage: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
          }}
        >
          {/* メインコンテンツ */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              padding: '60px',
              gap: '60px',
            }}
          >
            {/* 左側：キャラクター画像 */}
            <div
              style={{
                width: '400px',
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.card,
                borderRadius: '24px',
                border: '2px solid rgba(139, 92, 246, 0.3)',
                boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.25)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {characterImage ? (
                <img
                  src={characterImage}
                  alt="Character"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '20px',
                  }}
                >
                  {/* プレースホルダーキャラクター */}
                  <div
                    style={{
                      width: '200px',
                      height: '200px',
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '80px',
                    }}
                  >
                    ✨
                  </div>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: colors.text,
                      textAlign: 'center',
                    }}
                  >
                    {mbti} × {characterCode}
                  </div>
                </div>
              )}
            </div>

            {/* 右側：診断結果 */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '30px',
              }}
            >
              {/* タイトル */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                    backgroundClip: 'text',
                    color: 'transparent',
                    lineHeight: 1.2,
                  }}
                >
                  診断結果
                </div>
              </div>

              {/* MBTI情報 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px',
                  padding: '25px',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '16px',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '24px', color: colors.textDim }}>MBTI:</span>
                  <span style={{ fontSize: '28px', fontWeight: 'bold', color: colors.primary }}>
                    {mbti} {mbtiName}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '24px', color: colors.textDim }}>charactercode:</span>
                  <span style={{ fontSize: '28px', fontWeight: 'bold', color: colors.secondary }}>
                    {characterCode} {characterName}
                  </span>
                </div>
              </div>

              {/* スコア情報 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '20px',
                    background: `linear-gradient(135deg, ${colors.accent}20 0%, ${colors.accent}10 100%)`,
                    borderRadius: '12px',
                    border: `1px solid ${colors.accent}40`,
                  }}
                >
                  <span style={{ fontSize: '36px' }}>🏆</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={{ fontSize: '32px', fontWeight: 'bold', color: colors.accent }}>
                      {topScore} {topScoreValue}%
                    </span>
                    <span style={{ fontSize: '18px', color: colors.textDim }}>
                      あなたの最高スコア！
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '20px',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                  }}
                >
                  <span style={{ fontSize: '32px' }}>💕</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={{ fontSize: '20px', color: colors.textDim }}>相性のいいMBTI</span>
                    <span style={{ fontSize: '28px', fontWeight: 'bold', color: colors.secondary }}>
                      {compatibility}です！
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 下部：サービス情報 */}
          <div
            style={{
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 60px',
              backgroundColor: 'rgba(26, 31, 58, 0.8)',
              borderTop: '1px solid rgba(139, 92, 246, 0.2)',
            }}
          >
            {/* サービス名 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                TwinPersona
              </div>
              <div
                style={{
                  fontSize: '20px',
                  color: colors.textDim,
                }}
              >
                ツインパーソナ診断
              </div>
            </div>

            {/* URL & ハッシュタグ */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '10px',
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  color: colors.secondary,
                }}
              >
                twin-persona.vercel.app
              </div>
              <div
                style={{
                  fontSize: '16px',
                  color: colors.textDim,
                }}
              >
                #TwinPersona #ツインパーソナ #{mbti} #{characterCode}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}