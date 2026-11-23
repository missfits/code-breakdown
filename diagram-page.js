import { showMethods } from "./method-dialog.js";
import { pages } from "./diagram-data.js";
import mermaid from "./mermaid-config.js";

const colors = {
  input: ["Input", "#7db5ff", "#172d50"],
  wiring: ["Setup and coordination", "#c6a5ff", "#382658"],
  hardware: ["Subsystems and hardware", "#64dfcb", "#123d39"],
  command: ["Commands and controls", "#f5c677", "#493519"],
  pose: ["Pose and state", "#f9a8d4", "#4c253f"],
  filter: ["Filtering", "#a3e635", "#2d391b"],
};

export async function mountDetail(pageId) {
  const { title, nodes, edges } = pages[pageId];
  const diagram = document.getElementById("diagram");
  const legend = document.getElementById("legend");
  const categories = new Set(Object.values(nodes).map(({ kind }) => kind));

  const source = [
    "flowchart TD",
    "accTitle: " + title,
    ...Object.entries(nodes).map(([id, { label, kind }]) => `${id}["${label}"]:::${kind}`),
    edges,
    ...[...categories].map((kind) => {
      const [, stroke, fill] = colors[kind];
      return `classDef ${kind} fill:${fill},stroke:${stroke},color:#f1f5f9`;
    }),
    ...Object.keys(nodes).map((id) => `class ${id} method-${id}`),
  ].join("\n");

  for (const [kind, [label, accent]] of Object.entries(colors)) {
    if (!categories.has(kind)) continue;
    const key = document.createElement("span");
    key.className = "key";
    key.style.setProperty("--accent", accent);
    key.textContent = label;
    legend.append(key);
  }

  try {
    const { svg } = await mermaid.render("detail-" + pageId, source);
    diagram.innerHTML = svg;
    const width = diagram.querySelector("svg").viewBox.baseVal.width;
    if (width) diagram.style.setProperty("--diagram-width", Math.ceil(width * 0.9) + "px");

    for (const [id, details] of Object.entries(nodes)) {
      const node = diagram.querySelector(`g.node.method-${id}`);
      if (!node) continue;
      node.setAttribute("tabindex", "0");
      node.setAttribute("role", "button");
      node.setAttribute("aria-haspopup", "dialog");
      node.setAttribute("aria-label", `Show Java methods for ${details.label}`);
      node.addEventListener("click", () => {
        node.focus();
        showMethods(details);
      });
      node.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        showMethods(details);
      });
    }
  } catch (error) {
    console.error(error);
    const message = document.createElement("p");
    message.setAttribute("role", "alert");
    message.textContent = "This diagram could not load. Refresh the page to try again.";
    diagram.replaceChildren(message);
  }
}
