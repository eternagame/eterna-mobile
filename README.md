# Eterna Mobile
Port of the Eterna puzzle progression for Android and iOS.

## Setup dev environment
- Make sure you have the Cordova CLI installed globally (`npm install -g cordova`)
- Checkout the eternajs submodule.
- Run `npm install` in both the EternaMobile project and the eternajs submodule.
- Run `cordova prepare` to install the Cordova plugins and platforms.
- If you're using Visual Studio Code, make sure you have the Cordova Tools extension installed.
- Run `npm run build` at least once, which should also build eternajs.

For live reload:
- Run `npm run watch`.
- Launch the browser platform via Cordova Tools extension.
