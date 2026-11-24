(function () {
  "use strict";
  window.IC = window.IC || {};
  var PREFIX = "ic:";
  window.IC.storage = {
    get: function (key, fallback) {
      try {
        var v = window.localStorage.getItem(PREFIX + key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) {
        return fallback;
      }
    },
    set: function (key, value) {
      try {
        window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
        return true;
      } catch (e) {
        return false;
      }
    },
    remove: function (key) {
      try {
        window.localStorage.removeItem(PREFIX + key);
      } catch (e) {}
    },
  };
})();
