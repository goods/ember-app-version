## Module Report
### Unknown Global

**Global**: `Ember.testing`

**Location**: `addon/services/app-version.js` at line 21

```js

  isNewer: computed("latestVersion", function() {
    if (Ember.testing === true || addonConfig.isEnabled === false) {
      return false;
    }
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `addon/services/app-version.js` at line 28

```js

  start() {
    if (Ember.testing === true || addonConfig.isEnabled !== true) {
      return;
    }
```
