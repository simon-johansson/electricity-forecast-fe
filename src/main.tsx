import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/global.css";
import { Provider } from "react-redux";
import * as Sentry from "@sentry/react";
import { store } from "./lib/store";

Sentry.init({
  dsn: "https://a4a8be65f2ed4d4393fe83d6a4da8635@o1143416.ingest.sentry.io/6203867",
  integrations: [new Sentry.BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Sentry.ErrorBoundary>
    <Provider store={store}>
      <App />
    </Provider>
  </Sentry.ErrorBoundary>
);
