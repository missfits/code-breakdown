import { mountController } from "./controller.js";
import { views, mountSidebar } from "./navigation.js";
import { mountOverview } from "./overview.js";
import { mountDetail } from "./diagram-page.js";

const pageId = document.body.dataset.page;
const overview = views[0];
function getActiveView() {
  const id = pageId || window.location.hash.slice(1);
  return views.find((view) => view.id === id &&
    (pageId || view.href.startsWith("./index.html"))) || overview;
}

mountSidebar(document.querySelector(".sidebar"), getActiveView);
if (pageId === "controller-bindings") mountController();
else if (pageId) mountDetail(pageId);
else mountOverview(getActiveView);
