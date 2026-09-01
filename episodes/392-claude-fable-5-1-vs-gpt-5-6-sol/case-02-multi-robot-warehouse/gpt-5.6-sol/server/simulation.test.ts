import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { WarehouseSimulation, positionKey, type Position } from "./simulation.js";

const temporaryDirectories: string[] = [];

function createSimulation(): WarehouseSimulation {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "waypoint-test-"));
  temporaryDirectories.push(directory);
  return new WarehouseSimulation(path.join(directory, "state.json"), false);
}

afterEach(() => {
  temporaryDirectories.splice(0).forEach((directory) => fs.rmSync(directory, { recursive: true, force: true }));
});

describe("WarehouseSimulation", () => {
  it("creates the required deterministic warehouse inventory", () => {
    const simulation = createSimulation();
    const snapshot = simulation.getSnapshot();
    const catalog = simulation.getCatalog();

    expect(snapshot.robots).toHaveLength(8);
    expect(catalog.shelves.length).toBeGreaterThanOrEqual(20);
    expect(catalog.workstations).toHaveLength(4);
    expect(snapshot.map.cells.filter((cell) => cell.bottleneck)).toHaveLength(10);
  });

  it("never produces vertex collisions or edge swaps across simultaneous jobs", () => {
    const simulation = createSimulation();
    simulation.setRunning(false);
    simulation.createJob("S-28", "WS-01", "high");
    simulation.createJob("S-04", "WS-04", "normal");
    simulation.createJob("S-24", "WS-02", "high");
    simulation.createJob("S-08", "WS-03", "low");

    let previous = simulation.getSnapshot().robots.map((robot) => ({ ...robot.position }));
    for (let tick = 0; tick < 90; tick += 1) {
      simulation.singleStep();
      const snapshot = simulation.getSnapshot();
      const occupied = snapshot.robots.map((robot) => positionKey(robot.position));
      expect(new Set(occupied).size).toBe(occupied.length);
      snapshot.robots.forEach((robot, index) => {
        snapshot.robots.forEach((other, otherIndex) => {
          if (index >= otherIndex) return;
          const swapped =
            robot.position.x === previous[otherIndex].x &&
            robot.position.y === previous[otherIndex].y &&
            other.position.x === previous[index].x &&
            other.position.y === previous[index].y;
          expect(swapped).toBe(false);
        });
      });
      previous = snapshot.robots.map((robot) => ({ ...robot.position }));
    }
    expect(simulation.getSnapshot().jobs.filter((job) => job.status === "completed").length).toBeGreaterThanOrEqual(3);
  });

  it("replans immediately when the next route cell is blocked", () => {
    const simulation = createSimulation();
    simulation.setRunning(false);
    simulation.createJob("S-28", "WS-01", "high");
    const before = simulation.getSnapshot();
    const robot = before.robots.find((candidate) => candidate.jobId);
    expect(robot?.path.length).toBeGreaterThan(2);
    const next = robot!.path[1] as Position;

    simulation.setCellBlocked(next, true);
    const after = simulation.getSnapshot();
    const replanned = after.robots.find((candidate) => candidate.id === robot!.id)!;
    expect(replanned.path.slice(1).some((position) => positionKey(position) === positionKey(next))).toBe(false);
    expect(after.sequence).toBeGreaterThan(before.sequence);
  });

  it("restores the same state and sequence from disk", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "waypoint-test-"));
    temporaryDirectories.push(directory);
    const statePath = path.join(directory, "state.json");
    const first = new WarehouseSimulation(statePath, false);
    first.setRunning(false);
    first.createJob("S-01", "WS-04", "normal");
    first.singleStep();
    const expected = first.getSnapshot();

    const restored = new WarehouseSimulation(statePath, true).getSnapshot();
    expect(restored.tick).toBe(expected.tick);
    expect(restored.jobs).toEqual(expected.jobs);
    expect(restored.robots.map((robot) => robot.position)).toEqual(expected.robots.map((robot) => robot.position));
    expect(restored.sequence).toBeGreaterThan(expected.sequence);
  });
});
