import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "strict",
  theme: "base",
  htmlLabels: true,
  themeVariables: {
    darkMode: true,
    background: "#101827",
    lineColor: "#94a3b8",
    textColor: "#f1f5f9",
    edgeLabelBackground: "#101827",
    fontFamily: "system-ui, sans-serif",
  },
});

export default mermaid;
