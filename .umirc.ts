import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: '/', component: '@/pages/test' },
    { path: '/xg', component: '@/pages/testxg' },
    { path: "/docs", component: "docs" },
  ],
  npmClient: 'yarn',
});
