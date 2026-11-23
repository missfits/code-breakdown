export function showMethods({ label, methods }) {
  const dialog = document.querySelector("dialog");
  const heading = document.getElementById("method-heading");
  const methodList = document.getElementById("method-list");
  heading.textContent = label;
  methodList.replaceChildren();
  for (const [name, summary] of methods) {
    const term = document.createElement("dt");
    const code = document.createElement("code");
    code.textContent = name;
    term.append(code);
    const description = document.createElement("dd");
    description.textContent = summary;
    methodList.append(term, description);
  }
  dialog.showModal();
}
