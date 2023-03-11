import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression';
import path from "path"
import fs from "fs"
const cwdPath = process.cwd()
const apps = fs.readdirSync(cwdPath).
  filter(name => fs.lstatSync(name).isDirectory()).
  filter(c =>!(c.indexOf("-build")>-1|| ["mcu-src","node_modules"].indexOf(c) > -1))
export default defineConfig((param) => {
  const isBuild = param.command === "build"
  const site = param.mode;
  if (apps.indexOf(site) === -1) {
    throw new Error(`must --mode=${apps.join("|")}`)
  }
  const sitePath = path.resolve(cwdPath, site)
  const buildToPath = path.resolve(cwdPath, `${site}-build`)
  const indexHtmlPath = path.resolve(sitePath, "index.html")
  console.log({ isBuild, site, cwdPath, sitePath, buildToPath, indexHtmlPath })
  return {
    root: sitePath,
    plugins: [
      react(),
      viteCompression({deleteOriginFile:true})
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
    
      emptyOutDir: true,//打包前清空
      outDir: buildToPath,
      rollupOptions: {
        input: indexHtmlPath,
      }
    },
  }
})