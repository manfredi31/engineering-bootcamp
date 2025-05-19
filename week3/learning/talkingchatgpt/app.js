let count = 0
const span = document.getElementById("count");
const btn = document.getElementById("inc");

btn.addEventListener("click", () => {
    count += 1;
    span.textContent = count;
});
