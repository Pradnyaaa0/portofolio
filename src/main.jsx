import { Component } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App.jsx'

class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Global Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07070a] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
            <span className="text-2xl text-red-400">⚠️</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Terjadi Kesalahan pada Aplikasi</h2>
          <p className="text-sm text-neutral-400 max-w-md mb-2">
            Sistem mendeteksi kendala pada beberapa komponen visual.
          </p>
          <pre className="text-xs bg-red-950/40 border border-red-800/40 text-red-300 p-4 rounded-xl max-w-xl overflow-x-auto text-left mb-6 font-mono">
            {this.state.error?.toString()}
            {'\n'}
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm transition-colors"
          >
            Muat Ulang Halaman
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <GlobalErrorBoundary>
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true, wheelMultiplier: 1.0 }}>
      <App />
    </ReactLenis>
  </GlobalErrorBoundary>,
)


