//@ts-check

(() => {
  const serviceUrl = "https://api.ca175.cdt.ca.gov/api/air-table";
  //const serviceUrl = "https://fa-cdt-ca175-w-p-001-stage.azurewebsites.net/api/air-table";
  //const serviceUrl = "http://localhost:12345/api/air-table";

  const siteKey = "6LfFwDcqAAAAAIwjIlgwSW9KAmrDfYIShsV4bX1d"; // Set this to your recaptch site key

  /** @type {HTMLButtonElement?} */
  const recaptchabutton = document.querySelector("button.g-recaptcha");
  if (!recaptchabutton) {
    console.error("Recaptcha button not found");
    return;
  }

  recaptchabutton.dataset.sitekey = siteKey;

  window.addEventListener("load", () => {
    getForm().addEventListener("submit", submitForm);
    getSubmitButton().addEventListener("click", () =>
      getForm().setAttribute("submit_attempted", "")
    );
  });

  function getForm() {
    return /** @type {HTMLFormElement} */ (
      document.getElementById("ContactUsForm")
    );
  }

  function getSubmitButton() {
    return /** @type { HTMLButtonElement } */ (
      getForm().querySelector("input[type=submit]")
    );
  }

  function goToThanksPage() {
    document.getElementById("urlThankyou")?.click();
  }

  function openModal() {
    document.getElementById("btnModal")?.click();
  }

  function openThanks() {
    document.getElementById("btnThanks")?.click();
  }

  function triggerRecaptcha() {
    recaptchabutton?.click(); //will trigger recaptchaCallback when complete
  }

  async function submitForm(/** @type { SubmitEvent } */ e) {
    e.preventDefault();

    getSubmitButton().disabled = true;
    setTimeout(() => (getSubmitButton().disabled = false), 5000);

    triggerRecaptcha();
  }

  window["recaptchaCallback"] = function (
    /** @type { string } */ g_recaptcha_response
  ) {
    const postBody = {
      captcha: { "g-recaptcha-response": g_recaptcha_response },
      fields: {}
    };

    for (const pair of new FormData(getForm())) {
      postBody.fields[pair[0]] = pair[1];
    }

    delete postBody.fields["g-recaptcha-response"]; //we already have it from the callback

    // eslint-disable-next-line jsdoc/no-undefined-types
    /** @type { RequestInit } */
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postBody)
    };

    fetch(serviceUrl, request)
      .then(async response => {
        if (response.ok) {
          return response.json();
        }

        throw new Error(
          `Can't submit - ${response.status}:${
            response.statusText
          } ${await response.text()}`
        );
      })
      .then(() => {
        openThanks();
      })
      .catch(error => {
        console.error(error);

        openModal();
      });
  };
})();
