// vite.config.mts
import dotenv from "file:///Users/tangxl/example/openblocks/client/node_modules/dotenv/lib/main.js";
import { defineConfig } from "file:///Users/tangxl/example/openblocks/client/node_modules/vite/dist/node/index.js";
import react from "file:///Users/tangxl/example/openblocks/client/node_modules/@vitejs/plugin-react/dist/index.mjs";
import viteTsconfigPaths from "file:///Users/tangxl/example/openblocks/client/node_modules/vite-tsconfig-paths/dist/index.mjs";
import svgrPlugin from "file:///Users/tangxl/example/openblocks/client/node_modules/vite-plugin-svgr/dist/index.mjs";
import checker from "file:///Users/tangxl/example/openblocks/client/node_modules/vite-plugin-checker/dist/esm/main.js";
import { visualizer } from "file:///Users/tangxl/example/openblocks/client/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import path from "path";
import chalk from "file:///Users/tangxl/example/openblocks/client/node_modules/chalk/source/index.js";
import { createHtmlPlugin } from "file:///Users/tangxl/example/openblocks/client/node_modules/vite-plugin-html/dist/index.mjs";
import { ensureLastSlash } from "file:///Users/tangxl/example/openblocks/client/packages/openblocks-dev-utils/util.js";
import { buildVars } from "file:///Users/tangxl/example/openblocks/client/packages/openblocks-dev-utils/buildVars.js";
import { globalDepPlugin } from "file:///Users/tangxl/example/openblocks/client/packages/openblocks-dev-utils/globalDepPlguin.js";
var __vite_injected_original_dirname = "/Users/tangxl/example/openblocks/client/packages/openblocks";
dotenv.config();
var apiProxyTarget = process.env.API_PROXY_TARGET;
var nodeServiceApiProxyTarget = process.env.NODE_SERVICE_API_PROXY_TARGET;
var nodeEnv = process.env.NODE_ENV ?? "development";
var edition = process.env.REACT_APP_EDITION;
var isEEGlobal = edition === "enterprise-global";
var isEE = edition === "enterprise" || isEEGlobal;
var isDev = nodeEnv === "development";
var isVisualizerEnabled = !!process.env.ENABLE_VISUALIZER;
var browserCheckFileName = `browser-check-${process.env.REACT_APP_COMMIT_ID}.js`;
var base = ensureLastSlash(process.env.PUBLIC_URL);
if (!apiProxyTarget && isDev) {
  console.log();
  console.log(chalk.red`API_PROXY_TARGET is required.\n`);
  console.log(chalk.cyan`Start with command: API_PROXY_TARGET=\{backend-api-addr\} yarn start`);
  console.log();
  process.exit(1);
}
var proxyConfig = {
  "/api": {
    target: apiProxyTarget,
    changeOrigin: false
  }
};
if (nodeServiceApiProxyTarget) {
  proxyConfig["/node-service"] = {
    target: nodeServiceApiProxyTarget
  };
}
var define = {};
buildVars.forEach(({ name, defaultValue }) => {
  define[name] = JSON.stringify(process.env[name] || defaultValue);
});
var viteConfig = {
  define,
  assetsInclude: ["**/*.md"],
  resolve: {
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    alias: {
      "@openblocks-ee": path.resolve(
        __vite_injected_original_dirname,
        isEE ? `../openblocks/src/${isEEGlobal ? "ee-global" : "ee"}` : "../openblocks/src"
      )
    }
  },
  base,
  build: {
    manifest: true,
    target: "es2015",
    cssTarget: "chrome63",
    outDir: "build",
    assetsDir: "static",
    emptyOutDir: false,
    rollupOptions: {
      output: {
        chunkFileNames: "[hash].js"
      }
    },
    commonjsOptions: {
      defaultIsModuleExports: (id) => {
        if (id.indexOf("antd/lib") !== -1) {
          return false;
        }
        return "auto";
      }
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          "@primary-color": "#3377FF",
          "@link-color": "#3377FF",
          "@border-color-base": "#D7D9E0",
          "@border-radius-base": "4px"
        },
        javascriptEnabled: true
      }
    }
  },
  server: {
    open: true,
    cors: true,
    port: 8e3,
    host: "0.0.0.0",
    proxy: proxyConfig
  },
  plugins: [
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint --quiet "./src/**/*.{ts,tsx}"',
        dev: {
          logLevel: ["error"]
        }
      }
    }),
    react({
      babel: {
        parserOpts: {
          plugins: ["decorators-legacy"]
        }
      }
    }),
    viteTsconfigPaths({
      projects: ["../openblocks/tsconfig.json", "../openblocks-design/tsconfig.json"]
    }),
    svgrPlugin({
      svgrOptions: {
        exportType: "named",
        prettier: false,
        svgo: false,
        titleProp: true,
        ref: true
      }
    }),
    globalDepPlugin(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          browserCheckScript: isDev ? "" : `<script src="${base}${browserCheckFileName}"><\/script>`
        }
      }
    }),
    isVisualizerEnabled && visualizer()
  ].filter(Boolean)
};
var browserCheckConfig = {
  ...viteConfig,
  define: {
    ...viteConfig.define,
    "process.env.NODE_ENV": JSON.stringify("production")
  },
  build: {
    ...viteConfig.build,
    manifest: false,
    copyPublicDir: false,
    emptyOutDir: true,
    lib: {
      formats: ["iife"],
      name: "BrowserCheck",
      entry: "./src/browser-check.ts",
      fileName: () => {
        return browserCheckFileName;
      }
    }
  }
};
var buildTargets = {
  main: viteConfig,
  browserCheck: browserCheckConfig
};
var buildTarget = buildTargets[process.env.BUILD_TARGET || "main"];
var vite_config_default = defineConfig(buildTarget || viteConfig);
export {
  vite_config_default as default,
  viteConfig
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3Rhbmd4bC9leGFtcGxlL29wZW5ibG9ja3MvY2xpZW50L3BhY2thZ2VzL29wZW5ibG9ja3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy90YW5neGwvZXhhbXBsZS9vcGVuYmxvY2tzL2NsaWVudC9wYWNrYWdlcy9vcGVuYmxvY2tzL3ZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvdGFuZ3hsL2V4YW1wbGUvb3BlbmJsb2Nrcy9jbGllbnQvcGFja2FnZXMvb3BlbmJsb2Nrcy92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgZG90ZW52IGZyb20gXCJkb3RlbnZcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgU2VydmVyT3B0aW9ucywgVXNlckNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5pbXBvcnQgdml0ZVRzY29uZmlnUGF0aHMgZnJvbSBcInZpdGUtdHNjb25maWctcGF0aHNcIjtcbmltcG9ydCBzdmdyUGx1Z2luIGZyb20gXCJ2aXRlLXBsdWdpbi1zdmdyXCI7XG5pbXBvcnQgY2hlY2tlciBmcm9tIFwidml0ZS1wbHVnaW4tY2hlY2tlclwiO1xuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gXCJyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXJcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgY2hhbGsgZnJvbSBcImNoYWxrXCI7XG5pbXBvcnQgeyBjcmVhdGVIdG1sUGx1Z2luIH0gZnJvbSBcInZpdGUtcGx1Z2luLWh0bWxcIjtcbmltcG9ydCB7IGVuc3VyZUxhc3RTbGFzaCB9IGZyb20gXCJvcGVuYmxvY2tzLWRldi11dGlscy91dGlsXCI7XG5pbXBvcnQgeyBidWlsZFZhcnMgfSBmcm9tIFwib3BlbmJsb2Nrcy1kZXYtdXRpbHMvYnVpbGRWYXJzXCI7XG5pbXBvcnQgeyBnbG9iYWxEZXBQbHVnaW4gfSBmcm9tIFwib3BlbmJsb2Nrcy1kZXYtdXRpbHMvZ2xvYmFsRGVwUGxndWluXCI7XG5cbmRvdGVudi5jb25maWcoKTtcblxuY29uc3QgYXBpUHJveHlUYXJnZXQgPSBwcm9jZXNzLmVudi5BUElfUFJPWFlfVEFSR0VUO1xuY29uc3Qgbm9kZVNlcnZpY2VBcGlQcm94eVRhcmdldCA9IHByb2Nlc3MuZW52Lk5PREVfU0VSVklDRV9BUElfUFJPWFlfVEFSR0VUO1xuY29uc3Qgbm9kZUVudiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID8/IFwiZGV2ZWxvcG1lbnRcIjtcbmNvbnN0IGVkaXRpb24gPSBwcm9jZXNzLmVudi5SRUFDVF9BUFBfRURJVElPTjtcbmNvbnN0IGlzRUVHbG9iYWwgPSBlZGl0aW9uID09PSBcImVudGVycHJpc2UtZ2xvYmFsXCI7XG5jb25zdCBpc0VFID0gZWRpdGlvbiA9PT0gXCJlbnRlcnByaXNlXCIgfHwgaXNFRUdsb2JhbDtcbmNvbnN0IGlzRGV2ID0gbm9kZUVudiA9PT0gXCJkZXZlbG9wbWVudFwiO1xuY29uc3QgaXNWaXN1YWxpemVyRW5hYmxlZCA9ICEhcHJvY2Vzcy5lbnYuRU5BQkxFX1ZJU1VBTElaRVI7XG5jb25zdCBicm93c2VyQ2hlY2tGaWxlTmFtZSA9IGBicm93c2VyLWNoZWNrLSR7cHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0NPTU1JVF9JRH0uanNgO1xuY29uc3QgYmFzZSA9IGVuc3VyZUxhc3RTbGFzaChwcm9jZXNzLmVudi5QVUJMSUNfVVJMKTtcblxuaWYgKCFhcGlQcm94eVRhcmdldCAmJiBpc0Rldikge1xuICBjb25zb2xlLmxvZygpO1xuICBjb25zb2xlLmxvZyhjaGFsay5yZWRgQVBJX1BST1hZX1RBUkdFVCBpcyByZXF1aXJlZC5cXG5gKTtcbiAgY29uc29sZS5sb2coY2hhbGsuY3lhbmBTdGFydCB3aXRoIGNvbW1hbmQ6IEFQSV9QUk9YWV9UQVJHRVQ9XFx7YmFja2VuZC1hcGktYWRkclxcfSB5YXJuIHN0YXJ0YCk7XG4gIGNvbnNvbGUubG9nKCk7XG4gIHByb2Nlc3MuZXhpdCgxKTtcbn1cblxuY29uc3QgcHJveHlDb25maWc6IFNlcnZlck9wdGlvbnNbXCJwcm94eVwiXSA9IHtcbiAgXCIvYXBpXCI6IHtcbiAgICB0YXJnZXQ6IGFwaVByb3h5VGFyZ2V0LFxuICAgIGNoYW5nZU9yaWdpbjogZmFsc2UsXG4gIH0sXG59O1xuXG5pZiAobm9kZVNlcnZpY2VBcGlQcm94eVRhcmdldCkge1xuICBwcm94eUNvbmZpZ1tcIi9ub2RlLXNlcnZpY2VcIl0gPSB7XG4gICAgdGFyZ2V0OiBub2RlU2VydmljZUFwaVByb3h5VGFyZ2V0LFxuICB9O1xufVxuXG5jb25zdCBkZWZpbmUgPSB7fTtcbmJ1aWxkVmFycy5mb3JFYWNoKCh7IG5hbWUsIGRlZmF1bHRWYWx1ZSB9KSA9PiB7XG4gIGRlZmluZVtuYW1lXSA9IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52W25hbWVdIHx8IGRlZmF1bHRWYWx1ZSk7XG59KTtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBjb25zdCB2aXRlQ29uZmlnOiBVc2VyQ29uZmlnID0ge1xuICBkZWZpbmUsXG4gIGFzc2V0c0luY2x1ZGU6IFtcIioqLyoubWRcIl0sXG4gIHJlc29sdmU6IHtcbiAgICBleHRlbnNpb25zOiBbXCIubWpzXCIsIFwiLmpzXCIsIFwiLnRzXCIsIFwiLmpzeFwiLCBcIi50c3hcIiwgXCIuanNvblwiXSxcbiAgICBhbGlhczoge1xuICAgICAgXCJAb3BlbmJsb2Nrcy1lZVwiOiBwYXRoLnJlc29sdmUoXG4gICAgICAgIF9fZGlybmFtZSxcbiAgICAgICAgaXNFRSA/IGAuLi9vcGVuYmxvY2tzL3NyYy8ke2lzRUVHbG9iYWwgPyBcImVlLWdsb2JhbFwiIDogXCJlZVwifWAgOiBcIi4uL29wZW5ibG9ja3Mvc3JjXCJcbiAgICAgICksXG4gICAgfSxcbiAgfSxcbiAgYmFzZSxcbiAgYnVpbGQ6IHtcbiAgICBtYW5pZmVzdDogdHJ1ZSxcbiAgICB0YXJnZXQ6IFwiZXMyMDE1XCIsXG4gICAgY3NzVGFyZ2V0OiBcImNocm9tZTYzXCIsXG4gICAgb3V0RGlyOiBcImJ1aWxkXCIsXG4gICAgYXNzZXRzRGlyOiBcInN0YXRpY1wiLFxuICAgIGVtcHR5T3V0RGlyOiBmYWxzZSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6IFwiW2hhc2hdLmpzXCIsXG4gICAgICB9LFxuICAgIH0sXG4gICAgY29tbW9uanNPcHRpb25zOiB7XG4gICAgICBkZWZhdWx0SXNNb2R1bGVFeHBvcnRzOiAoaWQpID0+IHtcbiAgICAgICAgaWYgKGlkLmluZGV4T2YoXCJhbnRkL2xpYlwiKSAhPT0gLTEpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiYXV0b1wiO1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBjc3M6IHtcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICBsZXNzOiB7XG4gICAgICAgIG1vZGlmeVZhcnM6IHtcbiAgICAgICAgICBcIkBwcmltYXJ5LWNvbG9yXCI6IFwiIzMzNzdGRlwiLFxuICAgICAgICAgIFwiQGxpbmstY29sb3JcIjogXCIjMzM3N0ZGXCIsXG4gICAgICAgICAgXCJAYm9yZGVyLWNvbG9yLWJhc2VcIjogXCIjRDdEOUUwXCIsXG4gICAgICAgICAgXCJAYm9yZGVyLXJhZGl1cy1iYXNlXCI6IFwiNHB4XCIsXG4gICAgICAgIH0sXG4gICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBvcGVuOiB0cnVlLFxuICAgIGNvcnM6IHRydWUsXG4gICAgcG9ydDogODAwMCxcbiAgICBob3N0OiBcIjAuMC4wLjBcIixcbiAgICBwcm94eTogcHJveHlDb25maWcsXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICBjaGVja2VyKHtcbiAgICAgIHR5cGVzY3JpcHQ6IHRydWUsXG4gICAgICBlc2xpbnQ6IHtcbiAgICAgICAgbGludENvbW1hbmQ6ICdlc2xpbnQgLS1xdWlldCBcIi4vc3JjLyoqLyoue3RzLHRzeH1cIicsXG4gICAgICAgIGRldjoge1xuICAgICAgICAgIGxvZ0xldmVsOiBbXCJlcnJvclwiXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgcmVhY3Qoe1xuICAgICAgYmFiZWw6IHtcbiAgICAgICAgcGFyc2VyT3B0czoge1xuICAgICAgICAgIHBsdWdpbnM6IFtcImRlY29yYXRvcnMtbGVnYWN5XCJdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSxcbiAgICB2aXRlVHNjb25maWdQYXRocyh7XG4gICAgICBwcm9qZWN0czogW1wiLi4vb3BlbmJsb2Nrcy90c2NvbmZpZy5qc29uXCIsIFwiLi4vb3BlbmJsb2Nrcy1kZXNpZ24vdHNjb25maWcuanNvblwiXSxcbiAgICB9KSxcbiAgICBzdmdyUGx1Z2luKHtcbiAgICAgIHN2Z3JPcHRpb25zOiB7XG4gICAgICAgIGV4cG9ydFR5cGU6IFwibmFtZWRcIixcbiAgICAgICAgcHJldHRpZXI6IGZhbHNlLFxuICAgICAgICBzdmdvOiBmYWxzZSxcbiAgICAgICAgdGl0bGVQcm9wOiB0cnVlLFxuICAgICAgICByZWY6IHRydWUsXG4gICAgICB9LFxuICAgIH0pLFxuICAgIGdsb2JhbERlcFBsdWdpbigpLFxuICAgIGNyZWF0ZUh0bWxQbHVnaW4oe1xuICAgICAgbWluaWZ5OiB0cnVlLFxuICAgICAgaW5qZWN0OiB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBicm93c2VyQ2hlY2tTY3JpcHQ6IGlzRGV2ID8gXCJcIiA6IGA8c2NyaXB0IHNyYz1cIiR7YmFzZX0ke2Jyb3dzZXJDaGVja0ZpbGVOYW1lfVwiPjwvc2NyaXB0PmAsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pLFxuICAgIGlzVmlzdWFsaXplckVuYWJsZWQgJiYgdmlzdWFsaXplcigpLFxuICBdLmZpbHRlcihCb29sZWFuKSxcbn07XG5cbmNvbnN0IGJyb3dzZXJDaGVja0NvbmZpZzogVXNlckNvbmZpZyA9IHtcbiAgLi4udml0ZUNvbmZpZyxcbiAgZGVmaW5lOiB7XG4gICAgLi4udml0ZUNvbmZpZy5kZWZpbmUsXG4gICAgXCJwcm9jZXNzLmVudi5OT0RFX0VOVlwiOiBKU09OLnN0cmluZ2lmeShcInByb2R1Y3Rpb25cIiksXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgLi4udml0ZUNvbmZpZy5idWlsZCxcbiAgICBtYW5pZmVzdDogZmFsc2UsXG4gICAgY29weVB1YmxpY0RpcjogZmFsc2UsXG4gICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgbGliOiB7XG4gICAgICBmb3JtYXRzOiBbXCJpaWZlXCJdLFxuICAgICAgbmFtZTogXCJCcm93c2VyQ2hlY2tcIixcbiAgICAgIGVudHJ5OiBcIi4vc3JjL2Jyb3dzZXItY2hlY2sudHNcIixcbiAgICAgIGZpbGVOYW1lOiAoKSA9PiB7XG4gICAgICAgIHJldHVybiBicm93c2VyQ2hlY2tGaWxlTmFtZTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn07XG5cbmNvbnN0IGJ1aWxkVGFyZ2V0cyA9IHtcbiAgbWFpbjogdml0ZUNvbmZpZyxcbiAgYnJvd3NlckNoZWNrOiBicm93c2VyQ2hlY2tDb25maWcsXG59O1xuXG5jb25zdCBidWlsZFRhcmdldCA9IGJ1aWxkVGFyZ2V0c1twcm9jZXNzLmVudi5CVUlMRF9UQVJHRVQgfHwgXCJtYWluXCJdO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoYnVpbGRUYXJnZXQgfHwgdml0ZUNvbmZpZyk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFXLE9BQU8sWUFB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U0FBUztBQUFBLElBQ1AsUUFBUTtBQUFBLE1BQ04sWUFBWTtBQUFBLE1BQ1osUUFBUTtBQUFBLFFBQ04sYUFBYTtBQUFBLFFBQ2IsS0FBSztBQUFBLFVBQ0gsVUFBVSxDQUFDLE9BQU87QUFBQSxRQUNwQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELE1BQU07QUFBQSxNQUNKLE9BQU87QUFBQSxRQUNMLFlBQVk7QUFBQSxVQUNWLFNBQVMsQ0FBQyxtQkFBbUI7QUFBQSxRQUMvQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELGtCQUFrQjtBQUFBLE1BQ2hCLFVBQVUsQ0FBQywrQkFBK0Isb0NBQW9DO0FBQUEsSUFDaEYsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsYUFBYTtBQUFBLFFBQ1gsWUFBWTtBQUFBLFFBQ1osVUFBVTtBQUFBLFFBQ1YsTUFBTTtBQUFBLFFBQ04sV0FBVztBQUFBLFFBQ1gsS0FBSztBQUFBLE1BQ1A7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELGdCQUFnQjtBQUFBLElBQ2hCLGlCQUFpQjtBQUFBLE1BQ2YsUUFBUTtBQUFBLE1BQ1IsUUFBUTtBQUFBLFFBQ04sTUFBTTtBQUFBLFVBQ0osb0JBQW9CLFFBQVEsS0FBSyxnQkFBZ0IsT0FBTztBQUFBLFFBQzFEO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsdUJBQXVCLFdBQVc7QUFBQSxFQUNwQyxFQUFFLE9BQU8sT0FBTztBQUNsQjtBQUVBLElBQU0scUJBQWlDO0FBQUEsRUFDckMsR0FBRztBQUFBLEVBQ0gsUUFBUTtBQUFBLElBQ04sR0FBRyxXQUFXO0FBQUEsSUFDZCx3QkFBd0IsS0FBSyxVQUFVLFlBQVk7QUFBQSxFQUNyRDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsR0FBRyxXQUFXO0FBQUEsSUFDZCxVQUFVO0FBQUEsSUFDVixlQUFlO0FBQUEsSUFDZixhQUFhO0FBQUEsSUFDYixLQUFLO0FBQUEsTUFDSCxTQUFTLENBQUMsTUFBTTtBQUFBLE1BQ2hCLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxNQUNQLFVBQVUsTUFBTTtBQUNkLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjtBQUVBLElBQU0sZUFBZTtBQUFBLEVBQ25CLE1BQU07QUFBQSxFQUNOLGNBQWM7QUFDaEI7QUFFQSxJQUFNLGNBQWMsYUFBYSxRQUFRLElBQUksZ0JBQWdCO0FBRTdELElBQU8sc0JBQVEsYUFBYSxlQUFlLFVBQVU7IiwKICAibmFtZXMiOiBbXQp9Cg==
