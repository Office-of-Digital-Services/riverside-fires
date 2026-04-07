
// Helper to dynamically add reCAPTCHA script to head (module-level, not per-instance)
function addRecaptchaScript() {
  if (!document.getElementById('recaptcha-script')) {
    const script = document.createElement('script');
    script.id = 'recaptcha-script';
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
}

class StaticFeedbackForm {
  constructor(form) {
    this.form = form;
    this.yesBtn = form.querySelector(".js-feedback-yes");
    this.noBtn = form.querySelector(".js-feedback-no");
    this.addDiv = form.querySelector(".feedback-form-add");
    this.label = form.querySelector(".js-feedback-field-label");
    this.submitBtn = form.querySelector(".js-feedback-submit");
    this.textarea = form.querySelector(".js-add-feedback");
    this.thanksAdd = form.querySelector(".feedback-thanks-add");
    this.thanksGeneral = form.querySelector(".js-feedback-thanks");
    this.init();
  }
  init() {
    if (
      !this.yesBtn ||
      !this.noBtn ||
      !this.addDiv ||
      !this.label ||
      !this.submitBtn ||
      !this.textarea ||
      !this.thanksAdd ||
      !this.thanksGeneral
    )
      return;

    // Handle click on Submit button
    this.submitBtn.addEventListener("click", e => {
      e.preventDefault();
      // Always hide the feedback-form-add section
      this.addDiv.classList.add("d-none");
      const redirectSuccessUrl = "/success";
      const redirectErrorUrl = "/error/?error_message=";
      const pageFeedbackPostServiceUrl =
        "https://api.template.webstandards.ca.gov/api/v2/airtable/disasteremail/app0ZwBwEi5jWuOH6/tblgCoYklqnNmtHK8/";
      this.submitBtn.disabled = true;

      grecaptcha.execute().then(key => {
        const recaptchaResponses = document.querySelectorAll(
          "textarea[name='g-recaptcha-response']"
        );
        recaptchaResponses.forEach(textarea => {
          textarea.value = key;
        });

        const request = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([...new FormData(this.form)])
        };
        fetch(pageFeedbackPostServiceUrl, request)
          .then(async response => {
            if (response.ok) {
              // Show thank you for comments if textarea has content, else show general thank you
              if (this.textarea.value.trim().length > 0) {
                this.thanksAdd.classList.remove("d-none");
                this.thanksGeneral.classList.add("d-none");
              } else {
                this.thanksGeneral.classList.remove("d-none");
                this.thanksAdd.classList.add("d-none");
              }
              window.location.href = redirectSuccessUrl;
              return;
            }
            throw new Error(await response.text());
          })
          .catch(error => {
            this.thanksAdd.classList.add("d-none");
            this.thanksGeneral.classList.add("d-none");
            window.location.href =
              redirectErrorUrl + encodeURIComponent(error.message);
          })
          .finally(() => {
            this.submitBtn.disabled = false;
          });
      });
    });

    // Handle click on Yes button
    this.yesBtn.addEventListener("click", e => {
      e.preventDefault();
      addRecaptchaScript();
      // Hide the feedback question section
      const questionDiv = this.form.querySelector(".js-feedback-form");
      if (questionDiv) questionDiv.classList.add("d-none");
      // Show the feedback form add section and update label for positive feedback
      this.addDiv.classList.remove("d-none");
      this.label.textContent = "Great! What were you looking for today?";
    });

    // Handle click on No button
    this.noBtn.addEventListener("click", e => {
      e.preventDefault();
      addRecaptchaScript();
      // Hide the feedback question section
      const questionDiv = this.form.querySelector(".js-feedback-form");
      if (questionDiv) questionDiv.classList.add("d-none");
      // Show the feedback form add section and update label for negative feedback
      this.addDiv.classList.remove("d-none");
      this.label.textContent = "What was the problem?";
    });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form.feedback-form");
  if (form) {
    new StaticFeedbackForm(form);
  }
});
