export default defineConfig({
  plugins: [react()],
  resolve: { dedupe: ['react', 'react-dom'] },
  server: {
    proxy: {
      '/api': 'http://localhost:4000'
    },
    allowedHosts: ['dwello-frontend-fjru.onrender.com']
  }
})