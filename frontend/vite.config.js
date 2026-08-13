import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const isLocalhostUrl = (value) => {
  try {
    const { hostname } = new URL(value)
    return hostname === 'localhost'
      || hostname === '127.0.0.1'
      || hostname.startsWith('127.')
      || hostname === '[::1]'
  } catch {
    return false
  }
}

export default defineConfig(({ command, mode }) => {
  const envDir = fileURLToPath(new URL('.', import.meta.url))
  const env = loadEnv(mode, envDir, '')
  const apiUrl = env.VITE_API_URL

  if (command === 'build') {
    if (!apiUrl) {
      throw new Error('VITE_API_URL is required for production builds')
    }

    if (isLocalhostUrl(apiUrl)) {
      throw new Error('VITE_API_URL must not point to localhost in production builds')
    }
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
