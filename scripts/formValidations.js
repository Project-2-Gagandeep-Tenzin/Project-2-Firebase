//Select inputs from query selector and store in respective variables.
const formElement = document.querySelector("form");
const firstNameElement = document.querySelector("#first-name");
const lastNameElement = document.querySelector("#last-name");
const phoneElement = document.querySelector("#phone");
const emailElement = document.querySelector("#email");
const messageElement = document.querySelector("#message");
const submitButtonElement = document.querySelector("#submit");

// Disable the submit button initially
submitButtonElement.disabled = true;

// add event listener on every element
firstNameElement.addEventListener("blur", validateForm);
lastNameElement.addEventListener("blur", validateForm);
phoneElement.addEventListener("blur", validateForm);
emailElement.addEventListener("blur", validateForm);
messageElement.addEventListener("blur", validateForm);

// these variables check validity of every input element and return boolean
let isFirstNameValid,
  islastNameValid,
  isPhoneValid,
  isEmailValid,
  isMessageValid = false;

// callback fn to validate every input element
function validateForm(e) {
  const inputElement = e.target;
  if (inputElement.id === "first-name") {
    if (inputElement.value === "") {
      errorMessages(inputElement, "First Name is required");
      isFirstNameValid = false;
    } else {
      errorMessages(inputElement);
      isFirstNameValid = true;
    }
  }
  if (inputElement.id === "last-name") {
    if (inputElement.value === "") {
      errorMessages(inputElement, "Last Name is required");
      islastNameValid = false;
    } else {
      errorMessages(inputElement);
      islastNameValid = true;
    }
  }
  if (inputElement.id === "phone") {
    const phoneFormat = /^[0-9]{10}$/;
    if (phoneElement.value === "") {
      errorMessages(phoneElement, "Phone no. is required");
      isPhoneValid = false;
    } else if (!phoneFormat.test(phoneElement.value)) {
      errorMessages(phoneElement, "Phone no. is not valid");
      isPhoneValid = false;
    } else {
      errorMessages(phoneElement);
      isPhoneValid = true;
    }
  }
  if (inputElement.id === "email") {
    if (emailElement.value === "") {
      errorMessages(emailElement, "Email is required");
      isEmailValid = false;
    } else if (!emailElement.checkValidity()) {
      errorMessages(emailElement, "Please enter a valid email");
      isEmailValid = false;
    } else {
      errorMessages(emailElement);
      isEmailValid = true;
    }
  }
  if (inputElement.id === "message") {
    if (messageElement.value === "") {
      errorMessages(messageElement, "Message is required");
      isMessageValid = false;
    } else {
      errorMessages(messageElement);
      isMessageValid = true;
    }
  }
  // this condition check validity of every input element and enable or diable the submit btn
  if (
    isFirstNameValid &&
    islastNameValid &&
    isPhoneValid &&
    isEmailValid &&
    isMessageValid
  ) {
    submitButtonElement.disabled = false;
  } else {
    submitButtonElement.disabled = true;
  }
}

// This fn will recieve the args and render the msg to the page
const errorMessages = (inputElement, errorMsg = null) => {
  //   chekcing if there is any error msg
  if (errorMsg) {
    // this will make span element display and add the error msg
    inputElement.nextElementSibling.style.display = "inline";
    inputElement.style.borderBottom = "1px solid #ff3333";
    inputElement.nextElementSibling.textContent = errorMsg;
  } else {
    // if there is no error msg, hide the span element
    inputElement.nextElementSibling.style.display = "none";
    inputElement.style.borderBottom = "1px solid  lightgrey";
  }
};

// add event listener on submit form
formElement.addEventListener("submit", () => {
  alert("Message has sent successfully");
  window.history.back();
});
