export function showAlert(message = "Thông báo") {
  return new Promise((resolve) => {
    const modal = document.getElementById("alertModal");
    const messageEl = document.getElementById("alertMessage");
    const okBtn = document.getElementById("alertOkBtn");

    messageEl.textContent = message;
    modal.classList.remove("hidden");

    okBtn.onclick = () => {
      modal.classList.add("hidden");
      resolve();
    };
  });
}