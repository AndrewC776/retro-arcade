const toast = document.getElementById("toast");

toast.onclick = () => toast.classList.add("hide");

export function displayMessage(message: string, duration: number) {
  toast.classList.remove("hide");
  toast.innerText = message;

  setTimeout(() => toast.classList.add("hide"), duration);
}
