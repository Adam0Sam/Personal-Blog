//color scheme functionality
const body = document.querySelector("body");
const scheme = document.getElementById("scheme");
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  body.classList.add("dark-scheme");
  scheme.classList.add("dark-scheme");
}
scheme.addEventListener("click", () => {
  body.classList.toggle("dark-scheme");
  scheme.classList.toggle("dark-scheme");
});

["./labas.json", "./ate.json"].forEach((fileName) => {
  fetch(fileName)
    .then((response) => response.json())
    .then((result) => console.log(result.content));
});
