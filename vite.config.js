import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proposed fix, applied on the fly: run react-grid's data-prop -> store sync in useLayoutEffect.
const gridSyncBeforePaint = {
  name: 'react-grid-sync-before-paint',
  transform(code, id) {
    if (!id.replaceAll('\\', '/').includes('@svar-ui/react-grid/dist/index.es.js')) return null
    const alias = code.match(/useEffect as (\w+)/)?.[1]
    const syncStart = alias && code.lastIndexOf(`${alias}(() => {`, code.indexOf('.init({'))
    if (!alias || syncStart < 0) throw new Error('react-grid data sync effect not found')
    return code.slice(0, syncStart).replace(`useEffect as ${alias}`, `useEffect as ${alias}, useLayoutEffect as layoutEffect`)
      + 'layoutEffect' + code.slice(syncStart + alias.length)
  },
}

export default defineConfig(({ mode }) => ({
  cacheDir: `node_modules/.vite-${mode}`,
  plugins: [react(), ...(mode === 'react19-fixed' ? [gridSyncBeforePaint] : [])],
  optimizeDeps: mode === 'react19-fixed' ? { rolldownOptions: { plugins: [gridSyncBeforePaint] } } : {},
  resolve: mode === 'react18'
    ? {
        alias: [
          { find: /^react(\/.*)?$/, replacement: 'react18$1' },
          { find: /^react-dom(\/.*)?$/, replacement: 'react-dom18$1' },
        ],
      }
    : {},
}))
