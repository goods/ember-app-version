"use strict";

const ONE_MINUTE = 60000;

module.exports = function() {
  return {
    APP: {
      "app-version": {
        url: "version.json",
        versionPath: "version",
        extractConfigFromIndexJSON: false,
        pollInterval: 5 * ONE_MINUTE,
        pollDelay: 30 * ONE_MINUTE,
        autostart: true,
        isEnabled: true
      }
    }
  };
};
