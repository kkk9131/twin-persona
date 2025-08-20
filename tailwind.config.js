/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ダークリッチテーマ基本色
        dark: {
          900: '#0f0f0f',  // 最も深い黒
          800: '#1a1a1a',  // 主背景
          700: '#262626',  // カード背景
          600: '#404040',  // ボーダー/区切り
          500: '#525252',  // 無効状態
          400: '#737373',  // セカンダリテキスト
          300: '#a3a3a3',  // プライマリテキスト
          200: '#d4d4d4',  // 強調テキスト
          100: '#f5f5f5',  // 最高輝度
        },
        // MBTIグループ別リッチカラーパレット（ダーク調整済み）
        analysts: {
          primary: '#9d74e8',   // リッチパープル
          secondary: '#b794f6', // ソフトパープル
          accent: '#805ad5',    // ディープパープル
          glow: '#9d74e8'       // グロウエフェクト用
        },
        diplomats: {
          primary: '#4fd1c7',   // リッチティール
          secondary: '#81e6d9', // ソフトティール
          accent: '#319795',    // ディープティール
          glow: '#4fd1c7'
        },
        sentinels: {
          primary: '#48bb78',   // リッチグリーン
          secondary: '#68d391', // ソフトグリーン
          accent: '#38a169',    // ディープグリーン
          glow: '#48bb78'
        },
        explorers: {
          primary: '#ed8936',   // リッチアンバー
          secondary: '#fbb341', // ソフトアンバー
          accent: '#dd6b20',    // ディープアンバー
          glow: '#ed8936'
        },
        // アクセントカラー
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        platinum: {
          400: '#e5e7eb',
          500: '#d1d5db',
          600: '#9ca3af',
        }
      },
      fontFamily: {
        'sans': ['Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Meiryo', 'sans-serif'],
        'display': ['Inter', 'Noto Sans JP', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(157, 116, 232, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(157, 116, 232, 0.8)' },
        },
      },
      backgroundImage: {
        'rich-gradient': 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #262626 100%)',
        'card-gradient': 'linear-gradient(145deg, #1a1a1a 0%, #262626 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
      },
      boxShadow: {
        'rich': '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        'rich-inner': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.05)',
        'glow-purple': '0 0 20px rgba(157, 116, 232, 0.5)',
        'glow-teal': '0 0 20px rgba(79, 209, 199, 0.5)',
        'glow-green': '0 0 20px rgba(72, 187, 120, 0.5)',
        'glow-amber': '0 0 20px rgba(237, 137, 54, 0.5)',
      },
    },
  },
  plugins: [],
}