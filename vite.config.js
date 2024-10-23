import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  // const API_URL = `${env.VITE_API_URL ?? 'http://localhost:3000'}`;
  const PORT = `${env.VITE_PORT ?? '3000'}`;
  console.log(env, 'env');
  return {
    preview: {
      port: PORT,
    },
    server: {
      // proxy: {
      // 	'/api': API_URL,
      // },
      port: PORT,
    },
    build: {
      outDir: 'build',
    },
    plugins: [react()],
    define: {
      'process.env': env,
    },
  };
});

// https://vitejs.dev/config/
// export default defineConfig({
// 	plugins: [react()],
// 	server: {
// 		// proxy: {
// 		// 	'/api': API_URL,
// 		// },
// 		port: import.meta.env.VITE_PORT,
// 	},
// });
