//@ts-check
const { minify } = require("terser");
const { PurgeCSS } = require("purgecss");
const postcss = require("postcss");
const postcssNested = require("postcss-nested");

/**
 * @typedef {import("./node_modules/@11ty/eleventy/src/defaultConfig.js").defaultConfig} EleventyDefaultConfig
 * @typedef {import("@11ty/eleventy/UserConfig").default} EleventyConfig
 */

module.exports = async function (
  /** @type {EleventyConfig} **/ eleventyConfig
) {
  const domain =
    "https://as-cdt-ods-webserv-riverside-fires-p-001-b7f7d5a2hngha3hz.westus-01.azurewebsites.net/";

  eleventyConfig.addGlobalData("layout", "base-layout");

  eleventyConfig.addPassthroughCopy({
    "src/images": "images",
    "src/root": "/",
    "src/fonts": "fonts"
  });

  eleventyConfig.addWatchTarget("./src");

  /**
   * @param {string} content
   */
  const minifyCSS = content =>
    content
      .replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "")
      .replace(/ {2,}/g, " ")
      .replace(/ ([{:}]) /g, "$1")
      .replace(/([{:}]) /g, "$1")
      .replace(/([;,]) /g, "$1")
      .replace(/ !/g, "!");

  // PurgeCSS filter to extract only used CSS
  eleventyConfig.addFilter(
    "purgeCSS",
    async function purgeCSS(
      /** @type {string} */ css,
      /** @type {string} */ html
    ) {
      const purge = await new PurgeCSS().purge({
        content: [
          {
            raw: "<html><body>" + html + "</body></html>",
            extension: "html"
          }
        ],
        css: [
          {
            raw: css
          }
        ],
        safelist: [
          ":focus",
          ":hover",
          /focus/,
          "focus-visible",
          "focus-within",
          ":first-child",
          ":last-child",
          /cagov-feedback/,
          /feedback-form/,
          /cagov-feedback\s*>\s*section\s*>\s*div\.feedback-form/
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
      });
      return purge[0].css;
    }
  );

  // For making a non-nested fallback and replacing custom media queries
  eleventyConfig.addFilter("flattenCSS", async (/** @type {string} */ code) => {
    // Replace "@media (width >=" with "@media (min-width:"
    const replaced = code.replace(
      /@media\s*\(width\s*>=/g,
      "@media (min-width:"
    );
    const result = await postcss([postcssNested]).process(replaced, {
      from: undefined
    });
    return result.css;
  });

  eleventyConfig.addNunjucksAsyncFilter(
    "cssmin",
    /**
     *
     * @param {string} code
     * @param {(arg0: null, arg1: string) => void} callback
     */

    async (code, callback) => {
      callback(null, minifyCSS(code));
    }
  );

  eleventyConfig.addNunjucksAsyncFilter(
    "jsmin",
    /**
     *
     * @param {string} code
     * @param {(arg0: null, arg1: string) => void} callback
     */
    async (code, callback) => {
      const minified = await minify(code);
      callback(null, minified.code || "");
    }
  );

  // canonical shortcode
  // Usage <link href="{% canonical %}" rel="canonical" />
  eleventyConfig.addShortcode(
    "canonical",
    /** @type {  (this: { ctx: { page: { url: string } } }) => string} */ function () {
      return domain + this.ctx.page.url;
    }
  );

  /**
   * Wraps content in a specified HTML tag with optional attributes.
   */
  eleventyConfig.addFilter(
    "wrapTag",
    function (
      /** @type {string} */ content,
      /** @type {string} */ tagName,
      /** @type {string} */ attributes = ""
    ) {
      let attrs = attributes.trim() ? " " + attributes.trim() : "";
      attrs += ' id="custom-inline-styles"';
      return `<${tagName}${attrs}>${content}</${tagName}>`;
    }
  );

  eleventyConfig.addNunjucksAsyncFilter(
    "jsmin",
    /**
     *
     * @param {string} code
     * @param {(arg0: null, arg1: string) => void} callback
     */
    async (code, callback) => {
      const minified = await minify(code);
      callback(null, minified.code || "");
    }
  );

  //Start with default config, easier to configure 11ty later
  /** @type {EleventyDefaultConfig} */
  const config = {
    // allow nunjucks templating in .html files
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["html", "njk", "11ty.js", "md"],
    keys: {},
    dir: {
      // site content pages
      input: "pages"
    }
  };

  return config;
};
