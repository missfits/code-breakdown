import { showMethods } from "./method-dialog.js";

const controls = [
  { id: "lt", symbol: "LT", label: "Left trigger",
    driver: ["shuttleCommand()", "Hold to shuttle and clear score mode"],
    copilot: ["runShooterMediumDistanceCommand()", "Hold for medium-distance scoring"] },
  { id: "rt", symbol: "RT", label: "Right trigger",
    driver: ["outtakeCommand()", "Hold to reverse the mechanisms and clear score mode"],
    copilot: ["runShooterFarDistanceCommand()", "Hold for far-distance scoring"] },
  { id: "lb", symbol: "LB", label: "Left bumper",
    driver: ["configureBindingsCompetition()", "Hold with A, B, X, or Y for the alternate command"],
    copilot: ["configureBindingsCompetition()", "Hold with A, B, X, or Y for the alternate command"] },
  { id: "rb", symbol: "RB", label: "Right bumper",
    driver: ["setSlowmodeButton()", "Hold for slow mode"],
    copilot: ["runShooterCloseDistanceCommand()", "Hold for close-distance scoring"] },
  { id: "ls", symbol: "LS", label: "Left stick",
    driver: ["defaultDrive()", "Move to translate the robot"],
    copilot: null },
  { id: "rs", symbol: "RS", label: "Right stick",
    driver: ["defaultDrive()", "Move to rotate the robot"],
    copilot: null },
  { id: "dpad", symbol: "+", label: "D-pad",
    driver: ["zeroPivotCommand()", "Hold any direction to zero the intake pivot"],
    copilot: ["resetToDeployPosition()", "Any direction resets the pivot position reference to deployed"] },
  { id: "a", symbol: "A", label: "A",
    driver: ["pointWheelsinX()", "Hold to point the wheels in an X", ["snapToBump()", "Hold to align with the bump"]],
    copilot: ["runAllRollersCommand()", "Hold to run roller, indexer, and column forward", ["runAllRollersBackCommand()", "Hold to run roller, indexer, and column backward"]] },
  { id: "b", symbol: "B", label: "B",
    driver: ["spinUpShooterCommand()", "Press to spin up the shooter and enter score mode", ["runShooterCloseDistanceCommand()", "Hold for manual close-distance scoring"]],
    copilot: ["runIndexerColumnCommand()", "Hold to run indexer and column forward", ["runIndexerColumnBackCommand()", "Hold to run indexer and column backward"]] },
  { id: "x", symbol: "X", label: "X",
    driver: ["intakeModeCommand()", "Press for intake mode and clear score mode", ["intakeOnlyModeCommand()", "Press for pivot and roller intake only"]],
    copilot: ["runRollerIndexerCommand()", "Hold to run roller and indexer forward", ["runRollerIndexerBackCommand()", "Hold to run roller and indexer backward"]] },
  { id: "y", symbol: "Y", label: "Y",
    driver: ["neutralModeCommand()", "Press for neutral mode and clear score mode", ["storePivotCommand()", "Press to store the pivot"]],
    copilot: ["voltageDeployPivotCommand()", "Hold to deploy the pivot", ["voltageStorePivotCommand()", "Hold to raise the pivot"]] },
];

export function mountController() {
  const graphic = document.getElementById("controller");
  const rows = document.getElementById("binding-rows");
  const buttons = controls.map(({ id, symbol, label }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "xbox-button xbox-" + id;
    button.textContent = symbol;
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-haspopup", "dialog");
    graphic.append(button);
    return button;
  });

  function update(role) {
    rows.replaceChildren();
    controls.forEach((control, index) => {
      const { label } = control;
      const button = buttons[index];
      const [method, action, alternate] = control[role] || [];
      button.disabled = !action;
      button.title = action || "No competition binding";
      button.onclick = () => {
        const methods = [[method, action]];
        if (alternate) methods.push([alternate[0], "With LB: " + alternate[1]]);
        button.focus();
        showMethods({ label, methods });
      };

      const row = rows.insertRow();
      const name = document.createElement("th");
      name.scope = "row";
      name.textContent = label;
      row.append(name);
      row.insertCell().textContent = action || "Unbound";
      row.insertCell().textContent = alternate?.[1] || "—";
    });
  }

  document.querySelector(".controller-toggle").addEventListener("change", (event) => update(event.target.value));
  update(document.querySelector('input[name="controller-role"]:checked').value);
}
