import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import type { ViteSentryPluginOptions } from "vite-plugin-sentry";
import viteSentry from "vite-plugin-sentry";

const sentryConfig: ViteSentryPluginOptions = {
  org: "my-energy-price-dt",
  project: "frontend",
  deploy: {
    env: "production",
  },
  setCommits: {
    auto: true,
  },
  sourceMaps: {
    include: ["./dist/assets"],
    ignore: ["node_modules"],
    urlPrefix: "~/assets",
  },
};

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), viteSentry({ ...sentryConfig, authToken: env.VITE_SENTRY_AUTH_TOKEN })],
    server: { host: "0.0.0.0" },
    build: {
      sourcemap: true,
    },
  };
});
