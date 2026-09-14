(function (root) {
  "use strict";

  const location = root && root.location;
  const isProductionPath = location &&
    location.hostname === "przemyslawchmura-coder.github.io" &&
    ["/VFR-Master", "/VFR-Master/"].includes(location.pathname);

  if (!isProductionPath) return;

  root.REVLOG_CONFIG = Object.freeze({
    environment: "production",
    recoveryRedirectUrl: "https://przemyslawchmura-coder.github.io/VFR-Master/"
  });
})(typeof window !== "undefined" ? window : null);
