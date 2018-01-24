# ember-app-version

This addon exposes a service that polls a URL to determine if a newer version of the Ember appthan the one that is currently running in the user's browser is available . The app can then decide to reload itself, show the user a message prompting to reload, etc.

Depending on config, the service can read JSON at the URL (including traversing a configured path to version data) or just plain text. It is currently unopinionated about version numbers and just performs a simple comparison. If the URL version mismatches the browser version it will assume the URL version is newer.

Also - this addon will work with [https://github.com/ember-cli-deploy/ember-cli-deploy-json-config](ember-cli-deploy-json-config) out the box with a couple of config tweaks (see below).

### Addon is useful when:

* there is a critical hotfix that needs to pushed to all users
* users have kept a tab open in their browser for days/weeks/years and their current version is becoming unstable as the API/etc changes
* you have a shiny new feature and need emotional validation from knowing all your users are forced to use it immediately. Without exception.

## Installation

* `ember install ember-app-version`

## Usage

Using the `app-version` service:

* `isNewer`: Flag used to trigger actions like showing a message or reloading when a new version of the app is available.
* `latestVersion`: The retrieved latest version.
* `start()`: Start polling the URL for versions.
* `restart()`: Restarts the polling (the initial `pollDelay` will be used again).
* `stop()`: Stops polling.

## Configuration

This addon uses the Ember CLI project's configuration as defined in `config/environment.js`.

### Configuration Parameters

* `pollInterval` (Default: `300000` 5 minutes): In ms. Interval between polls to the URL.
* `pollDelay` (Default: `1800000` 30 minutes): In ms. Initial delay before polling starts. A freshly loaded app should be assumed to be latest version so no need to start polling straight away.
* `autostart` (Default: `true`): Start the polling service on app load.
* `isEnabled` (Default: `true`): Whether the service is enabled or not. E.g this should probably be disabled in the development environment.
* `url` (Default: `version.json`): The URL to be polled. Can be relative or absolute.
* `versionPath` (Default: `version`): The path to traverse to obtain the version value. If value for this, reponse is is treated as JSON. If null, treated as plain text.
* `extractConfigFromIndexJSON` (Default: `false`): Special case setting when using ember-cli-deploy-json-config. Set to true to extract the config from the payload.

### Example configuration for ember-cli-deploy-json-config

Install [https://github.com/ember-cli-deploy/ember-cli-deploy-json-config](ember-cli-deploy-json-config) along with the rest of your deploy pipeline

```
...
  "app-version": {
    url: "index.json",
    versionPath: "APP.version",
    extractConfigFromIndexJSON: true
  }
...
```

## Example

A common pattern is to create a component in your app and insert it into application.hbs. For example:

application.hbs

```
{{app-new-version}}
{{outlet}}
```

component.js

```
...
export default Component.extend({
  appVersion: inject("app-version"),

  actions: {
    reload() {
      set(this, "isReloading", true);
      window.location.reload(true);
    },

    dismiss() {
      get(this, "appVersion").restart();
    }
  }
});
```

template.hbs

```
{{#if appVersion.isNewer}}
  <h1>There is a new version of the app available</h1>
  <button {{action "reload"}}>Reload</button>
  <button {{action "dismiss"}}>Do it later</button>
{{/if}}
```

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
