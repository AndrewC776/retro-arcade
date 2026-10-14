# Petty kingdoms - js13kGames 2023
Entry for js13kGames 2023 (theme: 13th Century).

### Links
* js13kGames 2023 entry: https://js13kgames.com/entries/petty-kingdoms
* Itch.io: https://wiserim.itch.io/petty-kingdoms
* Newgrounds: https://www.newgrounds.com/portal/view/912248

### Description
Take control over one of 4 kingdoms and unite the land under your rule.

Recruit, move armies and conquer your neighbors.


### Features
* Up to 4 players local multiplayer (hot seat)
* Computer controlled opponents with 3 difficulty levels
* Map generation
* 3 map sizes (10, 16 and 36 regions)
* Full screen mode (if supported)

### Controls
Click / touch to interact.

### Tips
* To buy / send troops you have to click region owned by you first.
* You can move your troops only to directly neighboring regions.
* After recruiting, moving or attacking, used troops cannot move or attack till the next turn (but can defend the region).
* During attack either attacker or defender can receive advantage: 0-50% increase to army strength.

### Building game
To build and zip game use ```npm run build``` command.

The build HTML file and it's zip file will be in ```build``` folder.

### Known issues
Game is using SVG graphics extensively which can cause problems with rendering on Safari browser (both macOS and iOS).

The other browsers (Chrome, Firefox, Opera, Edge) display game properly.
