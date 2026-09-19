// Run with: node --test
// No package.json on purpose: adding one would make Railpack pick the Node
// provider instead of serving this repo as a static site.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// Loads scripts/growthSpeed.js the way the browser does (globals, no modules),
// with a stub `game` and `document` so we can observe side effects.
function loadGrowthSpeed() {
  const inputEl = { value: "" };
  const ctx = {
    game: { growthSpeed: 1 },
    document: { getElementById: (id) => (id === "growthSpeedInput" ? inputEl : null) },
  };
  const src = fs.readFileSync(path.join(__dirname, "..", "scripts", "growthSpeed.js"), "utf8");
  vm.runInNewContext(src, ctx);
  return { ...ctx, inputEl };
}

test("clampGrowthSpeed keeps in-range values unchanged", () => {
  const { clampGrowthSpeed } = loadGrowthSpeed();
  assert.equal(clampGrowthSpeed(2.5), 2.5);
  assert.equal(clampGrowthSpeed("7"), 7);
});

test("clampGrowthSpeed clamps to [0.1, 1000]", () => {
  const { clampGrowthSpeed } = loadGrowthSpeed();
  assert.equal(clampGrowthSpeed(0), 0.1);
  assert.equal(clampGrowthSpeed(-5), 0.1);
  assert.equal(clampGrowthSpeed(5000), 1000);
});

test("clampGrowthSpeed falls back to 1 for unparseable input", () => {
  const { clampGrowthSpeed } = loadGrowthSpeed();
  assert.equal(clampGrowthSpeed(""), 1);
  assert.equal(clampGrowthSpeed("abc"), 1);
  assert.equal(clampGrowthSpeed(undefined), 1);
  assert.equal(clampGrowthSpeed(NaN), 1);
});

test("setGrowthSpeed stores the clamped value on game and echoes it to the input", () => {
  const { setGrowthSpeed, game, inputEl } = loadGrowthSpeed();
  setGrowthSpeed("50000");
  assert.equal(game.growthSpeed, 1000);
  assert.equal(inputEl.value, 1000);
});

test("syncGrowthSpeedInput copies game.growthSpeed into the input", () => {
  const { syncGrowthSpeedInput, game, inputEl } = loadGrowthSpeed();
  game.growthSpeed = 3;
  syncGrowthSpeedInput();
  assert.equal(inputEl.value, 3);
});

test("computeTimeDivider matches the original formula at 1x speed", () => {
  const { computeTimeDivider } = loadGrowthSpeed();
  // 500ms elapsed -> 1000/500 = 2, so perSecond.div(2) is added per tick
  assert.equal(computeTimeDivider(500, 1), 2);
});

test("computeTimeDivider halves the divider at 2x speed (doubling gains)", () => {
  const { computeTimeDivider } = loadGrowthSpeed();
  assert.equal(computeTimeDivider(500, 2), 1);
});

test("computeTimeDivider never drops below the 0.0001 floor", () => {
  const { computeTimeDivider } = loadGrowthSpeed();
  // absurdly long gap (e.g. tab was suspended) must not produce divide-by-~0 blowups
  assert.equal(computeTimeDivider(1e12, 1000), 0.0001);
});
