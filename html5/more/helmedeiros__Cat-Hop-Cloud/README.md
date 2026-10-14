# Cat Hop Cloud

Help a lost black cat spend its luck energy to hop back home through the clouds.

**[Play it on GitHub Pages](https://helmedeiros.github.io/Cat-Hop-Cloud/)**

A tiny browser puzzle game built as a single self-contained HTML file for the
[js13kGames](https://js13kgames.com/) 2024 competition — under 13 KB zipped, no
external dependencies, shapes drawn instead of images.

## The game

Your cat starts on cloud 0 with 100 luck points and must visit every checkpoint,
then return to cloud 0 with luck to spare. Each jump costs luck equal to the
distance, and not every cloud is friendly.

| Cloud       | Effect                                                  |
| ----------- | ------------------------------------------------------- |
| Safe        | Normal cloud, safe to land on.                          |
| Thunder     | Lose 2 extra luck points.                               |
| Wind        | Your next jump gets +1 distance for free.               |
| Lucky       | Gain 5 luck points.                                     |
| Checkpoint  | Must visit all of these before going home.              |
| One-Way     | Forces your next jump to be exactly 2 clouds.           |

After turn 5, each turn costs an extra luck point — so be quick.

## Controls

| Key   | Action                          |
| ----- | ------------------------------- |
| `1`–`9` | Jump that many clouds forward. |
| `R`   | Reset the current level.        |
| `I`   | Toggle the instructions menu.   |

## Modes

Version 2.0 adds 10 hand-designed levels that introduce mechanics progressively —
tutorials, checkpoint routing, wind-boost puzzles, one-way mazes, and master
levels that combine everything.

## Local development

```sh
git clone https://github.com/helmedeiros/Cat-Hop-Cloud.git
open index.html        # play locally
./build.sh             # build the js13kGames submission bundle
```

## License

[MIT](LICENSE)
