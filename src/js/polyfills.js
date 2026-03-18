window.addEventListener("DOMContentLoaded", () => {
  (function () {
    if (!CSS.supports("selector(&)")) {
      // hide broken content until styles are flattened
      console.log(
        "Browser does not support CSS nesting, loading flattened CSS."
      );
      // Remove or disable the old inline styles if present
      var customInlineStyles = document.getElementById("custom-inline-styles");
      if (customInlineStyles) {
        customInlineStyles.disabled = true;
      }

      // Add a link element for the flattened CSS
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/css/custom.flat.css";
      link.id = "custom-flat-css";
      document.head.appendChild(link);
    }
  })();
});
