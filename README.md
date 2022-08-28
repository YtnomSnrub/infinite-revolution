# Infinite Revolution

WARNING: THIS SYSTEM IS STILL UNDER ACTIVE DEVELOPMENT.

This is a FoundryVTT implementation of the Infinite Revolution: First Flight Edition system by Gwendolyn Clark, found at https://gwencie.itch.io/infinite-revolution.

## What is Infinite Revolution?

> In **Infinite Revolution**, you play as a **Revolver** — a human whose spirit burns so **hot, quick, and bright** it would reduce their atoms to ash if for not an implanted turbine called a **Revolver Drive**. A race of entropic predators called the **Veil** has swallowed most of your system, and now it's time to **take it back** — for yourself, for your friends, and for everyone back on Earth. They're counting on you.

If that sounds cool (it does) then please check out the system: https://gwencie.itch.io/infinite-revolution. You'll need the rules from there in order to play using the system on Foundry.

## Development Setup

- `npm i`: Install dependencies
- `npm run build`: Compile CSS and compendium packs
- `npm run build:css`: Build CSS from Less
- `npm run build:watch`: Monitor Less for changes and build CSS on change
- `npm run build:json`: Extract compendium packs to JSON
- `npm run build:clean`: Clean extracted pack JSON to remove excess data
- `npm run build:db`: Compile compendium pack JSON to pack .db files
- `npm run lint`: Run eslint for the project
- `npm run lint:fix`: Automatically fix lint issues
