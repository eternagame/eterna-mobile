# Eterna Mobile
Port of the Eterna puzzle progression for Android and iOS.

Interested in development? Join the discussion on the Eterna Discord!

[![Eterna Discord](https://discord.com/api/guilds/702618517589065758/widget.png?style=banner2)](https://discord.gg/KYeTwux)

## Setup dev environment
- Checkout the eternajs submodule. (`git submodule init` followed by `git submodule update`)
- Create a `./eternajs/.env.local` and set `MOBILE_APP=true` (you may also want to change `APP_SERVER_URL` and `ENGINE_LOCATION`)
- Run `npm install` in both the top-most folder and the eternajs submodule.
- Make sure there is a `www` folder in the top-most folder (needed by cordova commands) - create it, if it's not there.
- Run `npx cordova prepare` to install the Cordova plugins and platforms.
Either
    - For a one-off build, run either `npm run build:dev` or `npm run build:prod` at least once,
    which will also build eternajs.
    - For live reload, run `npm run watch` (you will also have to have built eternajs previously)
- Use `npx cordova run <platform>` to test the app - see the [Cordova docs](https://cordova.apache.org/docs/en/latest/reference/cordova-cli/#cordova-run-command) for details. `npx cordova run browser` is probably a good starting point.

## For production builds
- Ensure you have a `./.env.local` with `APP_SERVER_URL=https://eternagame.org`
- Ensure you have a `./eternajs/.env.local` with `APP_SERVER_URL=https://eternagame.org`, `MOBILE_APP=true`, `DEBUG=false`, and `ENGINE_LOCATION` set correctly
