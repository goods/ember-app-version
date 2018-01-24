import config from "ember-get-config";

const addonConfig = config.APP["app-version"];

export function initialize(appInstance) {
  if (addonConfig.autostart === true && addonConfig.isEnabled === true) {
    const { container = appInstance } = appInstance;
    const appVersion = container.lookup("service:app-version");
    appVersion.start();
  }
}

export default {
  name: "app-version",
  initialize
};
