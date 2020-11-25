/*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
import Ember from "ember";
import Service from "@ember/service";
import { computed, get, set } from "@ember/object";
import { isPresent } from "@ember/utils";
import fetch from "fetch";
import config from "ember-get-config";
import { task, timeout } from "ember-concurrency";

const addonConfig = config.APP["app-version"];

export default Service.extend({
  version() {
    const {
      APP: { version },
    } = config;
    return version;
  },

  latestVersion: null,

  isNewer: computed("latestVersion", function () {
    if (Ember.testing === true || addonConfig.isEnabled === false) {
      return false;
    }
    return this.version() !== get(this, "latestVersion");
  }),

  start() {
    if (Ember.testing === true || addonConfig.isEnabled !== true) {
      return;
    }
    set(this, "latestVersion", this.version());
    get(this, "checkVersion").perform();
  },

  restart() {
    return this.start();
  },

  stop() {
    get(this, "checkVersion").cancelAll();
  },

  checkVersion: task(function* () {
    yield timeout(addonConfig.pollDelay);
    while (true) {
      try {
        let response = yield fetch(
          addonConfig.url,
          addonConfig.fetchOptions || {}
        );

        let latestVersion = null;
        if (isPresent(addonConfig.versionPath)) {
          let json = yield response.json();
          if (addonConfig.extractConfigFromIndexJSON === true) {
            json = JSON.parse(decodeURIComponent(json.meta[0].content));
          }
          latestVersion = get(json, addonConfig.versionPath);
        } else {
          latestVersion = yield response.text();
        }

        if (isPresent(latestVersion)) {
          set(this, "latestVersion", latestVersion);
        }
      } catch (e) {
        // continue regardless of error
      }

      yield timeout(addonConfig.pollInterval);
    }
  }).restartable(),
});
