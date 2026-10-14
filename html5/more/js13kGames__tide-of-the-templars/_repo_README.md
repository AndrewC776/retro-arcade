## Tide of the templars

An entry for the 2023 [js13 game competition](https://js13kgames.com) built with [kontra.js](https://straker.github.io/kontra/getting-started)

Embark on a perilous voyage in the 13th-century world of "Tide of the Templars." As a valiant Templar knight returning home after the last crusade, your mission is to steer the ship through treacherous waters. Utilize the W and S keys to navigate the ship, as you strive to keep the vessel afloat and the crew motivated.

Test your skills with precise controls, avoiding rocks. Collect fish to replenish energy and keep your crew ready for the challenges ahead. Can you guide the Templar knight safely home on this treacherous journey? Prepare to embark on an unforgettable seafaring experience in "Tide of the Templars."

## Requirements

The commands assume [Yarn](https://yarnpkg.com/en/docs/install) is installed.

## Commands

### `yarn install`

Installs dependencies.

### `yarn start`

Starts [webpack-dev-server](https://webpack.js.org/configuration/dev-server/) at `http://0.0.0.0:8080`. You should be able to access the server on your mobile device from your home network by going to your computer's IP address (e.g. `http://192.168.0.2:8080`).

### `yarn build`

Builds, minifies, and inlines the game to `./dist/index.html`. This command also runs [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer), and places the report in `./dist/report.html`. This report may be handy in figuring out which of your source files is putting you over the edge of 13k.

### `yarn party`

Builds, minifies, inlines, and zips the game to `./zipped/game.zip`. This command finishes with a log message letting you know if the zip file is under 13k.
