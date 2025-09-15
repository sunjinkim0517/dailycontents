// src/mocks/enable-msw.ts
const useMSW =
  import.meta.env.DEV &&
  String(import.meta.env.VITE_USE_MSW ?? "true").trim().toLowerCase() === "true";

if (useMSW) {
  const { worker } = await import("./browser");
  await worker.start({
    onUnhandledRequest: "warn",
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
  });
  console.info("[MSW] enabled");
} else {
  // 아무 것도 안 함 (프로덕션/비활성화)
}