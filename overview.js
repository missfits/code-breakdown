import React from "react";
import { createRoot } from "react-dom/client";
import mermaid from "./mermaid-config.js";
import { views } from "./navigation.js";

const diagram = `
  flowchart TD
    accTitle: Robot-Code-2026 architecture
    accDescr: Main starts Robot, which creates RobotContainer. RobotContainer configures subsystem wiring, controller bindings, and autonomous routines. The subsystems include the swerve drivetrain, vision, intake and feed, and shooter.
    Main["Main · entry point"] -->|starts| Robot["Robot · lifecycle and command scheduling"]
    Robot -->|creates| Container["RobotContainer · wiring and configuration"]
    Container --> Subsystems["Subsystems"]
    Container --> Controls["Controller bindings"]
    Container --> Auto["Autonomous routines"]

    Subsystems --> Drive["Swerve drivetrain"]
    Subsystems --> Vision["Vision"]
    Subsystems --> Intake["Intake and feed<br/>Pivot · Roller · Indexer · Column"]
    Subsystems --> Shooter["Shooter"]

    classDef startup fill:#172d50,stroke:#7db5ff,color:#eff6ff
    classDef wiring fill:#382658,stroke:#c6a5ff,color:#faf5ff
    classDef subsystems fill:#123d39,stroke:#64dfcb,color:#ecfdf5
    classDef commands fill:#493519,stroke:#f5c677,color:#fff7e6
    class Main,Robot startup
    class Container wiring
    class Subsystems,Drive,Vision,Intake,Shooter subsystems
    class Controls,Auto commands
    class Robot nav-robot
    class Container nav-robot-container
    class Drive nav-swerve-drivetrain
    class Vision nav-vision
    class Intake nav-intake-feeder
    class Shooter nav-shooter
    class Controls nav-controller-bindings
    class Auto nav-autonomous-routines
  `;

const h = React.createElement;
const legend = [
  ["Startup and lifecycle", "#7db5ff"],
  ["Robot wiring", "#c6a5ff"],
  ["Subsystems", "#64dfcb"],
  ["Controls and autonomous", "#f5c677"],
];

function addViewLinks(svg) {
  const template = document.createElement("template");
  template.innerHTML = svg;

  for (const { id, title } of views) {
    const node = template.content.querySelector(`g.node.nav-${id}`);
    if (!node) continue;

    node.dataset.viewId = id;
    node.setAttribute("tabindex", "0");
    node.setAttribute("role", "button");
    node.setAttribute("aria-label", `Open ${title} view`);
  }

  return template.innerHTML;
}

export function mountOverview(getActiveView) {
  function Architecture() {
    const [view, setView] = React.useState(getActiveView);
    const [rendered, setRendered] = React.useState(null);

    React.useEffect(() => {
      const onNavigation = () => setView(getActiveView());
      window.addEventListener("hashchange", onNavigation);
      mermaid.render("robot-architecture", diagram).then(({ svg }) => {
        setRendered({ svg: addViewLinks(svg) });
      }).catch((error) => {
        console.error(error);
        setRendered({ error: true });
      });
      return () => window.removeEventListener("hashchange", onNavigation);
    }, []);

    function openNodeView(event) {
      const node = event.target.closest("[data-view-id]");
      if (!node) return;
      event.preventDefault();
      const destination = views.find(({ id }) => id === node.dataset.viewId);
      window.location.assign(destination.href);
    }

    return h("main", null,
      h("header", null,
        h("p", null, "Robot-Code-2026"),
        h("h1", null, view.title),
      ),
      view.id === "robot-architecture" ? h("figure", null,
        h("figcaption", null, legend.map(([label, color]) =>
          h("span", { className: "key", key: label, style: { "--accent": color } }, label),
        )),
        rendered?.svg ? h("div", {
          className: "diagram",
          role: "region",
          "aria-label": "Robot architecture diagram",
          tabIndex: 0,
          onClick: openNodeView,
          onKeyDown: (event) => {
            if (event.key === "Enter" || event.key === " ") openNodeView(event);
          },
          dangerouslySetInnerHTML: { __html: rendered.svg },
        }) : h("div", { className: "diagram", role: rendered?.error ? "alert" : "status" },
          rendered?.error ? "This diagram could not load." : "Loading diagram…",
        ),
      ) : null,
    );
  }

  createRoot(document.getElementById("app")).render(h(Architecture));
}
