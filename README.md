# DodecaDragons

## Deploying (Dokploy / Railpack)

This is a plain static site — no build step. It ships with a `Staticfile` and
`railpack.json` so [Railpack](https://railpack.com) picks the `staticfile`
provider and serves the repo root with Caddy.

In Dokploy:

1. Create an **Application**, point it at this Git repo / branch.
2. Set **Build Type** to **Railpack**.
3. Deploy. No environment variables, ports, or Dockerfile are required —
   Caddy binds to the `PORT` Railpack provides.

## Settings

The in-game **Settings** window has a **Resource growth speed** field (default
`1`). It multiplies every per-second resource rate (gold, fire, magic, sigil
power, essences, …). Fixed per-tick gains and cooldowns are unaffected. The
value is stored in your save.
