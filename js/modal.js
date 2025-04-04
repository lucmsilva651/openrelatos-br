// https://www.w3schools.com/howto/howto_css_modals.asp

const helpModal = document.getElementById("helpModal");
const modalHeader = document.getElementById("modalHeader");
const modalBody = document.getElementById("modalBody");
const modalFooter = document.getElementById("modalFooter");
const closeBtn = document.getElementById("modalClose");

export function userAlert(header, body) {
  helpModal.style.display = "block";
  modalHeader.textContent = header;
  modalBody.innerHTML = body;

  closeBtn.addEventListener("click", () => {
    helpModal.style.display = "none";
  });

  window.onclick = function (event) {
    if (event.target == helpModal) {
      helpModal.style.display = "none";
    };
  };
};