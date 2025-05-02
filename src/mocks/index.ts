const shouldEnableMocks = () => {

  if (import.meta.env.DEV) {
    return true;
  }

  return import.meta.env.VITE_ENABLE_MOCKS === "true";
};

export async function initMocks() {
  if (typeof window === "undefined") {
    return;
  }

  if (shouldEnableMocks()) {
    try {
      const { worker } = await import("./browser");

      // Start the worker with appropriate options for the environment
      await worker.start({
        onUnhandledRequest: "bypass",
        serviceWorker: {
          url: import.meta.env.PROD
            ? `${window.location.origin}/mockServiceWorker.js`
            : "/mockServiceWorker.js",
        },
      });

      const envLabel = import.meta.env.PROD ? "production" : "development";
      console.log(`Mock Service Worker initialized (${envLabel} mode)`);

      return true;
    } catch (error) {
      console.error("MSW initialization failed:", error);
      return false;
    }
  }

  console.log("Mock Service Worker disabled for this environment");
  return false;
}
