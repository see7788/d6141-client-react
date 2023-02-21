import { name } from "./package.json"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
export default defineConfig((param) => {
  const isBuild = param.command === "build"
  const site = param.mode;
  const packageName = name
  const cwdPath = process.cwd()
  const sitePath=path.resolve(cwdPath, site)
  const buildToPath= path.resolve(cwdPath, `${packageName}-${site}-build`)
  const indexHtmlPath=path.resolve(sitePath, "index.html")
  console.log({isBuild,site,packageName,cwdPath,sitePath,buildToPath,indexHtmlPath})
  return {
    root: sitePath,
    plugins: [
      react(),
      // visualizer({ open: true })
    ],
    server: {
      open: !isBuild, //vite项目启动时自动打开浏览器
    },
    resolve: {},
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: isBuild,//清console
          drop_debugger: isBuild,//清debugger
        },
      },
      emptyOutDir: true,
      outDir: buildToPath,
      rollupOptions: {
        input: indexHtmlPath,
      }
    },
  }
})