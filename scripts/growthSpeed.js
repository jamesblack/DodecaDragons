//Resource growth speed setting. Multiplies every per-second resource rate that
//updateLarge() applies via timeDivider. Stored on game.growthSpeed so it saves/loads
//like the other settings. Fixed per-tick gains and cooldowns are deliberately unaffected.

const GROWTH_SPEED_MIN = 0.1
const GROWTH_SPEED_MAX = 1000
const GROWTH_SPEED_DEFAULT = 1

//Parses user input into a usable multiplier; garbage falls back to the default
function clampGrowthSpeed(value) {
  let speed = parseFloat(value)
  if (isNaN(speed)) return GROWTH_SPEED_DEFAULT
  return Math.min(Math.max(speed, GROWTH_SPEED_MIN), GROWTH_SPEED_MAX)
}

//Copies the saved value into the settings input (called on load and after set)
function syncGrowthSpeedInput() {
  document.getElementById("growthSpeedInput").value = game.growthSpeed
}

//Called by the settings input's onchange
function setGrowthSpeed(value) {
  game.growthSpeed = clampGrowthSpeed(value)
  syncGrowthSpeedInput()
}

//Replaces the inline formula in updateLarge(). At growthSpeed 1 this is exactly
//1000 / elapsedMs; a higher speed shrinks the divider so perSecond.div(timeDivider) grows.
function computeTimeDivider(elapsedMs, growthSpeed) {
  return Math.max(1000 / (elapsedMs * growthSpeed), 0.0001)
}
