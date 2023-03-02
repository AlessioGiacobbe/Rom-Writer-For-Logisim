var en = require("./translations.en.json");
var it = require("./translations.it.json");

const i18n = {
  translations: {
    en,
    it,
  },
  defaultLang: "it",
  useBrowserDefault: true,
};

module.exports = i18n;
