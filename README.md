# Eterna Mobile
Port of the Eterna puzzle progression for Android and iOS.

Interested in development? Join the discusson on the Eterna Discord!

[![Eterna Discord](https://discord.com/api/guilds/702618517589065758/widget.png?style=banner2)](https://discord.gg/KYeTwux)

## Setup dev environment
- Make sure you have the Cordova CLI installed globally (`npm install -g cordova`)
- Checkout the eternajs submodule. (`git submodule init` followed by `git submodule update`)
- Run `npm install` in both the top-most folder and the eternajs submodule.
- Create a folder called `www` in the top-most folder.
- Run `cordova prepare` to install the Cordova plugins and platforms.
- If you're using Visual Studio Code, make sure you have the Cordova Tools extension installed.
- Run `npm run build` at least once, which should also build eternajs.

For live reload:
- Run `npm run watch`.
- Launch the browser platform via Cordova Tools extension.
