export const views = [
  ["robot-architecture", "Robot architecture", "./index.html"],
  ["robot", "Robot", "./robot.html"],
  ["robot-container", "RobotContainer", "./robot-container.html"],
  ["swerve-drivetrain", "Swerve drivetrain", "./swerve-drivetrain.html"],
  ["vision", "Vision", "./vision.html"],
  ["intake-feeder", "Intake + feeder", "./intake-feeder.html"],
  ["shooter", "Shooter", "./shooter.html"],
  ["controller-bindings", "Controller bindings", "./controller-bindings.html"],
  ["autonomous-routines", "Autonomous routines", "./autonomous-routines.html"],
].map(([id, title, href]) => ({ id, title, href }));

export function mountSidebar(sidebar, getActiveView) {
  sidebar.innerHTML = `
    <h2 id="views-heading">Views</h2>
    <label for="view-search">Search views</label>
    <input id="view-search" type="search">
    <ul></ul>
    <p role="status" hidden>No matching views.</p>
  `;
  const search = sidebar.querySelector("input");
  const list = sidebar.querySelector("ul");
  const empty = sidebar.querySelector("[role=status]");
  const items = views.map(({ id, title, href }) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = href;
    link.textContent = title;
    item.append(link);
    list.append(item);
    return { id, title, href, item, link };
  });

  function filter() {
    const query = search.value.trim().toLowerCase();
    for (const { title, item } of items) {
      item.hidden = !title.toLowerCase().includes(query);
    }
    empty.hidden = items.some(({ item }) => !item.hidden);
  }

  function highlight() {
    const activeId = getActiveView().id;
    for (const { id, link } of items) {
      if (id === activeId) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
  }

  search.addEventListener("input", filter);
  window.addEventListener("hashchange", highlight);
  highlight();
}
