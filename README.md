# ember-app-version

This addon exposes a service that polls a URL to determine if a newer version of the Ember app than the one that is currently running in the user's browser is available. The app can then decide to reload itself, show the user a message prompting to reload, etc.

Depending on config, the service can read JSON at the URL (including traversing a configured path to version data) or just plain text. It is currently unopinionated about version numbers and just performs a simple comparison. If the URL version mismatches the browser version it will assume the URL version is newer.

Also - this addon will work with [https://github.com/ember-cli-deploy/ember-cli-deploy-json-config](ember-cli-deploy-json-config) out the box with a couple of config tweaks (see below).

### Addon is useful when:

- there is a critical hotfix that needs to pushed to all users
- users have kept a tab open in their browser for days/weeks/years and their current version is becoming unstable as the API/etc changes
- you have a shiny new feature and need emotional validation from knowing all your users are forced to use it immediately. Without exception.

* `ember install ember-app-version`

## Usage

Using the `app-version` service:

- `isNewer`: Flag used to trigger actions like showing a message or reloading when a new version of the app is available.
- `latestVersion`: The retrieved latest version.
- `start()`: Start polling the URL for versions.
- `restart()`: Restarts the polling (the initial `pollDelay` will be used again).
- `stop()`: Stops polling.

## Configuration

This addon uses the Ember CLI project's configuration as defined in `config/environment.js`.

### Configuration Parameters

- `pollInterval` (Default: `300000` 5 minutes): In ms. Interval between polls to the URL.
- `pollDelay` (Default: `1800000` 30 minutes): In ms. Initial delay before polling starts. A freshly loaded app should be assumed to be latest version so no need to start polling straight away.
- `autostart` (Default: `true`): Start the polling service on app load.
- `isEnabled` (Default: `true`): Whether the service is enabled or not. E.g this should probably be disabled in the development environment.
- `url` (Default: `version.json`): The URL to be polled. Can be relative or absolute.
- `versionPath` (Default: `version`): The path to traverse to obtain the version value. If value for this, reponse is is treated as JSON. If null, treated as plain text.
- `extractConfigFromIndexJSON` (Default: `false`): Special case setting when using ember-cli-deploy-json-config. Set to true to extract the config from the payload.
- `fetchOptions` (Default: `{}`): Allows you to set options on the fetch request. E.g you can control cache options, headers, cors mode, etc.

### Example configuration for ember-cli-deploy-json-config

Install [https://github.com/ember-cli-deploy/ember-cli-deploy-json-config](ember-cli-deploy-json-config) along with the rest of your deploy pipeline

```
...
  "app-version": {
    url: "index.json",
    versionPath: "APP.version",
    extractConfigFromIndexJSON: true,
    fetchOptions: {
        cache: "no-store"
    }
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

- Ember.js v2.18 or above
- Ember CLI v2.13 or above

## Tip: AWS and caching issues

Caching of the `index.json` on AWS can catch you out pretty easily leading to continous false positives for newer version notifications. Watch out for this if you're using `ember-cli-deploy-aws-pack`, `ember-cli-deploy-s3`, `ember-cli-deploy-cloudfront`.

The default headers in `ember-cli-deploy-s3` give a long cache expiration, which is great for all resources apart from the one that gives the latest app version.

To solve this, the s3 plugin needs to be run twice on deployment. The first uploads all the files with a long cache expiration and the second pass uploads just the index.json with no caching.

Alias the S3 plugin in your deploy config:

```
  var ENV = {
    build: {},
    pipeline: {
      activateOnDeploy: true,
      alias: {
        s3: { as: ["s3", "s3_nocache"] }
      }
    },
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      filePattern: "*"
    },
    s3_nocache: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      filePattern: "index.json",
      manifestPath: null,
      cacheControl: "no-cache, no-store, must-revalidate",
      expires: 0
    },
    cloudfront: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  };

  if (deployTarget === "production") {
    ENV.build.environment = "production";
    ENV.s3.bucket = "my-bucket";
    ENV.s3.region = "eu-west-1";
    ENV.s3_nocache.bucket = "my-bucket";
    ENV.s3_nocache.region = "eu-west-1";
    ENV.cloudfront.distribution = "ABCD1234";
    ENV.cloudfront.objectPaths = ["/index.html", "/index.json"];
  }

```

## Installation

```
ember install my-addon
```

## Usage

[Longer description of how to use the addon in apps.]

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
