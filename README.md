# Eterna Mobile
Port of the Eterna puzzle progression for Android and iOS.

Interested in development? Join the discussion on the Eterna Discord!

[![Eterna Discord](https://discord.com/api/guilds/702618517589065758/widget.png?style=banner2)](https://discord.gg/KYeTwux)

## Setup
- Checkout the eternajs submodule. (`git submodule init` followed by `git submodule update`)
- Create a `./eternajs/.env.local` and set `MOBILE_APP=true` (you may also want to change `APP_SERVER_URL` and `ENGINE_LOCATION`)
- Run `npm install` (which automatically installs eternajs dependencies and sets up our initial www folder as well)
- Run `npx cordova prepare`, which will:
    - Run our preprepare hooks, which clear out `www` and then build EternaJS and this app into `www`
    - Download any Cordova plugins
    - Initialize the native code for the relevant platforms, and copy our config, resources, www, etc to them

If you want to build for a specific platform you'll also need to install their respective prerequisites:
- [Android requirements](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html)
- [iOS requirements](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html)

## For development
To quickly test the app, run `npx cordova run <platform>`
This will do the following:
    - Run `cordova prepare`, as above
    - Run `cordova compile`, which actually builds native code for the relevant platform
    - Deploys to a device/emulator/web server depending on the configuration

`npx cordova run browser` is probably a good starting point, which will build the app for the browser, spin up
a local web server, and open your browser to it.

For more information, see the [Cordova CI documentation](https://cordova.apache.org/docs/en/latest/reference/cordova-cli/)

## For production builds
- Ensure you have a `./.env.local` with `APP_SERVER_URL=https://eternagame.org`
- Ensure you have a `./eternajs/.env.local` with `APP_SERVER_URL=https://eternagame.org`, `MOBILE_APP=true`, `DEBUG=false`, and `ENGINE_LOCATION` set correctly
- Run `npx cordova build --release` (which will run `cordova prepare` and `cordova compile`)
