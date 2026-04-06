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
      if (this.textarea.value.trim().length > 0) {
        // Show thank you for comments
        this.thanksAdd.classList.remove("d-none");
        this.thanksGeneral.classList.add("d-none");
      } else {
        // Show general thank you
        this.thanksGeneral.classList.remove("d-none");
        this.thanksAdd.classList.add("d-none");
      }
    });

    // Handle click on Yes button
    this.yesBtn.addEventListener("click", e => {
      e.preventDefault();
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
