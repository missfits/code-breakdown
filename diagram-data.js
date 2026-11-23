export const pages = {
  "robot-container": {
    "title": "RobotContainer",
    "intro": "Start at RobotContainer and follow the branches to see where the robot’s subsystems, driver controls, and autonomous commands are wired together.",
    "nodes": {
      "Robot": {
        "label": "Robot",
        "kind": "input",
        "methods": [
          [
            "Robot()",
            "Creates the container. Read Robot.java to see how the robot lifecycle uses it."
          ],
          [
            "autonomousInit()",
            "Gets the selected autonomous command and schedules it when one is available."
          ]
        ]
      },
      "Container": {
        "label": "RobotContainer",
        "kind": "wiring",
        "methods": [
          [
            "RobotContainer()",
            "Configures bindings for the current environment, installs named autonomous commands, and publishes the auto chooser. Subsystems are created in field initializers."
          ]
        ]
      },
      "Drive": {
        "label": "Swerve drivetrain",
        "kind": "hardware",
        "methods": [
          [
            "TunerConstants.createDrivetrain()",
            "Creates the drivetrain using the generated swerve configuration."
          ]
        ]
      },
      "Vision": {
        "label": "VisionSubsystem",
        "kind": "hardware",
        "methods": [
          [
            "VisionSubsystem(Pigeon2)",
            "Creates the configured localization cameras with access to the drivetrain gyro."
          ],
          [
            "RobotContainer.configureBindingsVision()",
            "Installs the local and global vision filter pipelines."
          ]
        ]
      },
      "Mechanisms": {
        "label": "Intake, feeder, and shooter",
        "kind": "hardware",
        "methods": [
          [
            "PivotSubsystem.deployPivotCommand()",
            "Creates a command to deploy the intake pivot."
          ],
          [
            "RobotCommandFactory.feedGamepieceCommand()",
            "Provides a starting point for reading how the mechanisms work together to feed a game piece."
          ]
        ]
      },
      "Controls": {
        "label": "Controller bindings",
        "kind": "command",
        "methods": [
          [
            "configureBindingsCompetition()",
            "Registers driver controls and the default drive command."
          ],
          [
            "configureBindingsSimulation()",
            "Sets up the simulation drive bindings."
          ]
        ]
      },
      "Factory": {
        "label": "RobotCommandFactory",
        "kind": "command",
        "methods": [
          [
            "intakeModeCommand()",
            "Builds the command used by the intake-mode binding."
          ],
          [
            "setDefaultCommand()",
            "Configures defaults for mechanisms."
          ]
        ]
      },
      "Auto": {
        "label": "PathPlanner auto chooser",
        "kind": "command",
        "methods": [
          [
            "createNamedCommands()",
            "Registers actions that the autonomous routines can trigger."
          ],
          [
            "getAutonomousCommand()",
            "Returns the command currently selected in the chooser."
          ]
        ]
      },
      "Pose": {
        "label": "Pose estimation",
        "kind": "pose",
        "methods": [
          [
            "updatePoseEst()",
            "Reads accepted camera measurements and passes them to the drivetrain. A pending post-bump reset takes a separate branch."
          ]
        ]
      }
    },
    "edges": "Robot -->|creates| Container\nContainer -->|creates| Drive\nContainer -->|creates| Vision\nContainer -->|creates| Mechanisms\nContainer -->|configures| Controls\nContainer -->|builds| Auto\nControls -->|trigger commands from| Factory\nFactory -->|coordinates| Drive\nFactory -->|coordinates| Mechanisms\nVision -->|accepted readings| Pose\nPose -->|updates pose| Drive\nAuto -->|selected command| Robot"
  },
  "swerve-drivetrain": {
    "title": "Swerve drivetrain",
    "intro": "Follow a driver or autonomous request into the drivetrain, then trace how the drivetrain reports motion and estimates where the robot is on the field.",
    "nodes": {
      "Joysticks": {
        "label": "Driver joysticks",
        "kind": "input",
        "methods": [
          [
            "RobotContainer.configureBindingsCompetition()",
            "Passes translation and rotation joystick suppliers into the default drive command."
          ],
          [
            "Controls.inputShape()",
            "Applies input shaping, including deadband and slow-mode scaling."
          ]
        ]
      },
      "Default": {
        "label": "Default drive command",
        "kind": "command",
        "methods": [
          [
            "DrivetrainCommandFactory.defaultDrive()",
            "Builds the normal driver command from translation and rotation inputs."
          ],
          [
            "CommandSwerveDrivetrain.getCommandFromRequest()",
            "Wraps a supplier of swerve requests in a drivetrain command."
          ]
        ]
      },
      "Auto": {
        "label": "PathPlanner AutoBuilder",
        "kind": "command",
        "methods": [
          [
            "CommandSwerveDrivetrain.configureAutoBuilder()",
            "Wires pose, pose reset, robot-relative speeds, and the output callback for path following."
          ]
        ]
      },
      "Tuner": {
        "label": "TunerConstants",
        "kind": "wiring",
        "methods": [
          [
            "createDrivetrain()",
            "Creates the drivetrain with the generated drivetrain and module constants."
          ]
        ]
      },
      "Drive": {
        "label": "CommandSwerveDrivetrain",
        "kind": "wiring",
        "methods": [
          [
            "CommandSwerveDrivetrain() constructors",
            "Initialize the swerve subsystem and configure PathPlanner."
          ],
          [
            "periodic()",
            "Applies the alliance-dependent operator perspective when appropriate."
          ]
        ]
      },
      "Modules": {
        "label": "Swerve modules",
        "kind": "hardware",
        "methods": [
          [
            "TunerConstants.createDrivetrain()",
            "Passes the four module configurations to the drivetrain."
          ],
          [
            "CommandSwerveDrivetrain.getCommandFromRequest()",
            "Routes a command's requests to the inherited setControl() method."
          ]
        ]
      },
      "Vision": {
        "label": "Vision pose measurements",
        "kind": "pose",
        "methods": [
          [
            "RobotContainer.updatePoseEst()",
            "Submits each accepted vision pose along with its timestamp and uncertainty."
          ],
          [
            "CommandSwerveDrivetrain.addVisionMeasurement()",
            "Converts FPGA timestamps to the drivetrain's time base before delegating the pose update."
          ]
        ]
      },
      "Telemetry": {
        "label": "Telemetry",
        "kind": "pose",
        "methods": [
          [
            "Telemetry.telemeterize()",
            "Publishes pose, speed, and current and target module states."
          ],
          [
            "RobotContainer.configureBindingsCompetition()",
            "Registers the telemetry callback with the drivetrain."
          ]
        ]
      }
    },
    "edges": "Joysticks --> Default\nDefault -->|swerve request| Drive\nAuto -->|robot-relative speeds| Drive\nTuner -->|creates| Drive\nDrive -->|controls| Modules\nVision -->|corrects pose| Drive\nDrive -->|pose and speeds| Auto\nDrive -->|state| Telemetry"
  },
  "vision": {
    "title": "Vision",
    "intro": "Each camera estimates the robot’s position from AprilTags. The code checks readings individually, compares readings across cameras, then hands accepted measurements to the drivetrain.",
    "nodes": {
      "Cameras": {
        "label": "Two configured AprilTag cameras",
        "kind": "hardware",
        "methods": [
          [
            "VisionSubsystem(Pigeon2)",
            "Creates the two active LocalizationCamera instances using their mounting transforms and the drivetrain gyro."
          ]
        ]
      },
      "Estimate": {
        "label": "Per-camera pose estimate",
        "kind": "input",
        "methods": [
          [
            "LocalizationCamera.updateCameraReading()",
            "Refreshes the current reading for one camera."
          ],
          [
            "LocalizationCamera.calculateNewCameraReading()",
            "Builds a candidate pose reading and applies the local filter pipeline."
          ]
        ]
      },
      "Local": {
        "label": "Local filters",
        "kind": "filter",
        "methods": [
          [
            "LocalVisionFilterPipeline.runAll()",
            "Checks a candidate against all enabled local filters."
          ],
          [
            "LocalPoseZRollPitchFilter.isValid()",
            "Checks whether the estimated height, roll, and pitch are plausible."
          ],
          [
            "LocalCameraPoseConsistencyDistanceToFusedPoseFilter.isValid()",
            "Checks the reading against camera history and the fused drivetrain pose."
          ]
        ]
      },
      "Fresh": {
        "label": "Timestamp check",
        "kind": "filter",
        "methods": [
          [
            "VisionSubsystem.isReadingTimestampValid()",
            "Checks that the reading is newer than the subsystem’s last accepted timestamp."
          ]
        ]
      },
      "Global": {
        "label": "Cross-camera filters",
        "kind": "filter",
        "methods": [
          [
            "GlobalVisionFilterPipeline.runAll()",
            "Runs the enabled global filters on the collected readings."
          ],
          [
            "GlobalCrossCameraConsensusFilter.validReadings()",
            "Applies the cross-camera consensus check."
          ]
        ]
      },
      "Readings": {
        "label": "Accepted readings, oldest first",
        "kind": "pose",
        "methods": [
          [
            "VisionSubsystem.periodic()",
            "Collects fresh readings, applies the global pipeline, and sorts accepted readings by timestamp."
          ],
          [
            "VisionSubsystem.getValidCameraReadings()",
            "Exposes the accepted readings to RobotContainer."
          ]
        ]
      },
      "Update": {
        "label": "RobotContainer pose update",
        "kind": "wiring",
        "methods": [
          [
            "RobotContainer.updatePoseEst()",
            "Chooses between the usual fusion loop and a pending post-bump reset. With a reset pending and no fresh post-bump reading, it waits for a later cycle."
          ]
        ]
      },
      "Fuse": {
        "label": "Fuse pose, time, and uncertainty",
        "kind": "pose",
        "methods": [
          [
            "RobotContainer.updatePoseEst()",
            "Sets vision measurement standard deviations and submits each accepted pose with its timestamp."
          ],
          [
            "CommandSwerveDrivetrain.addVisionMeasurement()",
            "Passes a time-aligned measurement to the drivetrain estimator."
          ]
        ]
      },
      "Reset": {
        "label": "Reset translation, keep gyro heading",
        "kind": "pose",
        "methods": [
          [
            "VisionSubsystem.getAverageTranslation()",
            "Averages the translations of the fresh post-bump readings."
          ],
          [
            "RobotContainer.updatePoseEst()",
            "Calls the inherited drivetrain resetPose() with that translation and the current heading."
          ]
        ]
      },
      "Drive": {
        "label": "Drivetrain pose",
        "kind": "hardware",
        "methods": [
          [
            "CommandSwerveDrivetrain.addVisionMeasurement()",
            "Provides the normal vision correction path into the drivetrain’s pose estimate."
          ]
        ]
      }
    },
    "edges": "Cameras --> Estimate\nEstimate --> Local\nLocal -->|passes| Fresh\nFresh -->|newer reading| Global\nGlobal -->|passes| Readings\nReadings --> Update\nUpdate -->|normal update| Fuse\nUpdate -->|fresh reading after bump| Reset\nFuse --> Drive\nReset --> Drive"
  },
  "robot": {
    "title": "Robot",
    "intro": "Follow the program from Main into the robot lifecycle. The scheduler runs every robot loop, while mode-init methods run when the robot changes modes.",
    "nodes": {
      "Start": {
        "label": "Main",
        "kind": "input",
        "methods": [
          [
            "Main.main()",
            "Starts WPILib with Robot::new."
          ]
        ]
      },
      "Robot": {
        "label": "Robot initialization",
        "kind": "wiring",
        "methods": [
          [
            "Robot()",
            "Creates RobotContainer, publishes an intake mechanism display, and sets the brownout voltage."
          ]
        ]
      },
      "Loop": {
        "label": "Robot loop",
        "kind": "wiring",
        "methods": [
          [
            "Robot.robotPeriodic()",
            "Runs the scheduler, updates the drivetrain pose from vision, and records robot diagnostics."
          ]
        ]
      },
      "Schedule": {
        "label": "Command scheduler",
        "kind": "command",
        "methods": [
          [
            "Robot.robotPeriodic()",
            "Calls CommandScheduler.run() to poll triggers, run commands, and call subsystem periodic methods."
          ]
        ]
      },
      "Pose": {
        "label": "Vision pose update",
        "kind": "pose",
        "methods": [
          [
            "RobotContainer.updatePoseEst()",
            "Passes accepted camera readings to the drivetrain pose estimator."
          ]
        ]
      },
      "Auto": {
        "label": "Enter autonomous",
        "kind": "command",
        "methods": [
          [
            "Robot.autonomousInit()",
            "Gets the selected command, resets positions through the container, and schedules the command if present."
          ]
        ]
      },
      "Teleop": {
        "label": "Enter teleop",
        "kind": "command",
        "methods": [
          [
            "Robot.teleopInit()",
            "Cancels the autonomous command when driver control begins."
          ]
        ]
      },
      "Test": {
        "label": "Enter test",
        "kind": "command",
        "methods": [
          [
            "Robot.testInit()",
            "Cancels commands that were already running."
          ]
        ]
      }
    },
    "edges": "Start --> Robot\nRobot -->|every robot loop| Loop\nLoop --> Schedule\nLoop --> Pose\nRobot -->|on mode entry| Auto\nRobot -->|on mode entry| Teleop\nRobot -->|on mode entry| Test"
  },
  "intake-feeder": {
    "title": "Intake + feeder",
    "intro": "Follow how the robot collects and feeds game pieces. RobotCommandFactory coordinates the mechanisms, and each subsystem owns its motor commands.",
    "nodes": {
      "Factory": {
        "label": "RobotCommandFactory",
        "kind": "wiring",
        "methods": [
          [
            "intakeModeCommand()",
            "Deploys the pivot and runs the roller, indexer, and column in parallel. The column runs backward in this mode."
          ],
          [
            "intakeOnlyModeCommand()",
            "Deploys the pivot and runs the roller without commanding the indexer or column."
          ]
        ]
      },
      "Pivot": {
        "label": "Intake pivot",
        "kind": "hardware",
        "methods": [
          [
            "PivotSubsystem.deployPivotHoldCommand()",
            "Deploys the intake and holds it in position."
          ],
          [
            "PivotSubsystem.storePivotCommand()",
            "Moves the pivot to its stored position."
          ]
        ]
      },
      "Roller": {
        "label": "Intake roller",
        "kind": "hardware",
        "methods": [
          [
            "RollerSubsystem.rollerVelocityCommand()",
            "Creates a roller velocity command."
          ],
          [
            "RollerSubsystem.rollerBackVelocityCommand()",
            "Creates the reverse roller velocity command."
          ]
        ]
      },
      "Indexer": {
        "label": "Indexer",
        "kind": "hardware",
        "methods": [
          [
            "IndexerSubsystem.indexerVelocityCommand()",
            "Creates the indexer velocity command."
          ],
          [
            "IndexerSubsystem.indexerBackVoltageCommand()",
            "Drives the indexer in reverse using voltage control."
          ]
        ]
      },
      "Column": {
        "label": "Feeder column",
        "kind": "hardware",
        "methods": [
          [
            "ColumnSubsystem.columnVelocityCommand()",
            "Creates a velocity command for the column."
          ],
          [
            "ColumnSubsystem.columnBackVoltageCommand()",
            "Drives the column in reverse using voltage control."
          ]
        ]
      },
      "Feed": {
        "label": "Feed game piece",
        "kind": "command",
        "methods": [
          [
            "RobotCommandFactory.feedGamepieceCommand()",
            "Starts the column and lets the roller, indexer, and pivot feed actions proceed once the column is up to speed or the wait times out."
          ]
        ]
      },
      "Ready": {
        "label": "Ready-to-feed trigger",
        "kind": "input",
        "methods": [
          [
            "RobotContainer.configureBindingsCompetition()",
            "Runs the feed command while the readiness trigger is true."
          ],
          [
            "RobotCommandFactory.getReadyToShootTrigger()",
            "Exposes the readiness trigger used by the binding."
          ]
        ]
      }
    },
    "edges": "Factory -->|deploys| Pivot\nFactory -->|runs| Roller\nFactory -->|runs| Indexer\nFactory -->|runs| Column\nReady -->|while true| Feed\nFeed -->|starts first| Column\nFeed -->|after column wait| Indexer\nFeed -->|after column wait| Roller\nFeed -->|after column wait| Pivot"
  },
  "shooter": {
    "title": "Shooter",
    "intro": "Trace the requested game-piece scoring speed from the command factory to the motor controllers, then see how velocity feedback gates feeding.",
    "nodes": {
      "Request": {
        "label": "Requested scoring speed",
        "kind": "input",
        "methods": [
          [
            "RobotCommandFactory.spinUpShooterCommand()",
            "Passes a dynamic velocity supplier to the shooter."
          ],
          [
            "RobotCommandFactory.runShooterCloseDistanceCommand()",
            "Provides an example of a preset scoring command."
          ]
        ]
      },
      "Command": {
        "label": "Shooter velocity command",
        "kind": "command",
        "methods": [
          [
            "ShooterSubsystem.shooterVelocityCommand()",
            "Accepts a fixed velocity or a supplier and delegates to the shared mechanism velocity command."
          ]
        ]
      },
      "Control": {
        "label": "Closed-loop velocity control",
        "kind": "wiring",
        "methods": [
          [
            "ShooterSubsystem.runClosedLoopVelocity()",
            "Builds the configured VelocityVoltage request and sends it to the lead motor."
          ]
        ]
      },
      "Motors": {
        "label": "Lead motor and two followers",
        "kind": "hardware",
        "methods": [
          [
            "ShooterSubsystem()",
            "Creates the three hardware objects and configures the follower motors to follow the lead motor."
          ]
        ]
      },
      "Ready": {
        "label": "Readiness and feeding",
        "kind": "pose",
        "methods": [
          [
            "RobotCommandFactory.getReadyToShootTrigger()",
            "Exposes the signal used to enable feeding."
          ],
          [
            "RobotContainer.configureBindingsCompetition()",
            "Schedules feedGamepieceCommand() while the readiness trigger is true."
          ]
        ]
      }
    },
    "edges": "Request --> Command\nCommand -->|velocity setpoint| Control\nControl -->|motor request| Motors\nMotors -->|velocity feedback| Ready"
  },
  "autonomous-routines": {
    "title": "Autonomous routines",
    "intro": "Follow a dashboard selection into autonomous execution. PathPlanner supplies the route, and named commands or event markers run robot actions along the way.",
    "nodes": {
      "Setup": {
        "label": "Register autonomous actions",
        "kind": "wiring",
        "methods": [
          [
            "RobotContainer.createNamedCommands()",
            "Registers named commands and event triggers for waits, intake, heading changes, and scoring."
          ]
        ]
      },
      "Chooser": {
        "label": "Dashboard auto chooser",
        "kind": "input",
        "methods": [
          [
            "RobotContainer()",
            "Publishes the chooser built by PathPlanner with “don't move” as the default."
          ],
          [
            "RobotContainer.getAutonomousCommand()",
            "Returns the current chooser selection."
          ]
        ]
      },
      "Start": {
        "label": "Autonomous entry",
        "kind": "command",
        "methods": [
          [
            "Robot.autonomousInit()",
            "Reads the selected command, calls resetPosition() on the container, and schedules the command if present."
          ]
        ]
      },
      "Path": {
        "label": "PathPlanner path following",
        "kind": "command",
        "methods": [
          [
            "CommandSwerveDrivetrain.configureAutoBuilder()",
            "Provides pose and chassis speeds to PathPlanner and applies its robot-relative drive outputs."
          ]
        ]
      },
      "Events": {
        "label": "Named commands and event markers",
        "kind": "input",
        "methods": [
          [
            "RobotContainer.createNamedCommands()",
            "Maps PathPlanner names and marker events to Java commands. Look for the matching names in the deploy/pathplanner files."
          ]
        ]
      },
      "Actions": {
        "label": "Subsystem actions",
        "kind": "hardware",
        "methods": [
          [
            "RobotCommandFactory.autoIntakeModeCommand()",
            "Runs the intake mechanisms while cycling the pivot zeroing command."
          ],
          [
            "RobotCommandFactory.autoShootWithVisionCommand()",
            "Builds the autonomous scoring sequence used by several markers."
          ]
        ]
      },
      "End": {
        "label": "Teleop handoff",
        "kind": "command",
        "methods": [
          [
            "Robot.teleopInit()",
            "Cancels the selected autonomous command when teleop starts."
          ]
        ]
      }
    },
    "edges": "Setup --> Chooser\nChooser -->|selected command| Start\nStart -->|schedules routine| Path\nPath -->|runs markers on the route| Events\nEvents -->|trigger| Actions\nStart -->|when driver control begins| End"
  }
};
