# 复古街机厅 · 离线版

405 款**开源 / 可自由分发**的游戏（HTML5 277 款、Game Boy 68 款、FC/NES 23 款、GBA 17 款、WonderSwan 10 款、Mega Drive 3 款、SNES 2 款、Atari 2600 2 款、DOOM 引擎 2 款、Master System 1 款），全部文件都在本地，断网也能玩。另外预置了 18 张 **MAME 官方免费街机**游戏卡片（需你自己下载 ROM，见下文）。
每款游戏的许可证和官方来源见 `games.json`、`LICENSES.md`，许可证原文在 `licenses/`。

## 怎么启动
模拟器需要通过 http 访问（直接双击 index.html 打不开游戏），所以附带了一个小服务器脚本，只要电脑装了 Python 3：

- **Windows**：双击 `start.bat`，会自动打开浏览器 http://localhost:8000
- **macOS / Linux**：终端运行 `./start.sh`（换端口：`./start.sh 9000`），然后打开 http://localhost:8000
- 手动：在本文件夹运行 `python3 -m http.server 8000`

没装 Python 可去 python.org 下载（Windows 安装时勾选 “Add to PATH”）。推荐 Chrome / Edge / Firefox 最新版。

## 操作
- 大厅可按名称/作者搜索，按平台、类型、许可证筛选；点卡片开始游戏
- 模拟器默认键位：方向键移动，`Z`/`X` 对应 B/A，`Enter` = Start，`Shift`（V）= Select，GBA 的 L/R 键在菜单里可查看/修改；游戏画面下方菜单可改键、存档/读档、全屏、接手柄
- HTML5 游戏一般用方向键或空格

## 加入你自己合法拥有的游戏（自动匹配资料）
**最简单：直接把文件丢进 `my-roms/` 文件夹，刷新大厅即可。** 大厅会自动扫描这个文件夹，并按文件名到内置资料库（`meta-db.js`，1,081 条街机/Flash 游戏的文字资料：标题、简介、类型、年份、开发商）里自动匹配，卡片上会显示“我的·已匹配资料”。

- 街机 zip 请保持 **romset 原名**（例如 `sf2.zip`、`mslug.zip`、`kof98.zip`），模拟器靠这个名字识别游戏；资料库也按 romset 名 / 英文标题匹配
- Neo Geo 游戏还需要把你自己的 `neogeo.zip`（BIOS）放进 `my-roms/`，会自动加载
- Flash 文件用游戏英文名命名即可匹配，例如 `bloxorz.swf`
- 其他平台按扩展名自动选模拟器：`.nes .gb .gbc .gba .sms .gg .md .gen .sfc .smc .pce .a26 .a78 .lnx .ws .wsc .col .ngp .wad`
- 资料库只有文字资料，没有任何图片、ROM 或 SWF

临时玩：大厅点 “▶ 打开我自己的游戏文件” 选文件即可（文件不会被复制），同样会自动匹配并在游戏页顶部显示资料。街机 zip 可在旁边下拉框选 自动 / MAME 2003-Plus / FinalBurn Neo。

想自定义标题/封面：用记事本打开 `my-games.js` 按示例加一行，例如：
`{id:"my1", title:"我的游戏", system:"nes", file:"my-roms/mygame.nes", cover:"covers/my1.png"},`
没填的字段会自动从资料库补全。`system` 可选 `nes gb gbc gba sms gg segaMD snes pce atari2600 atari7800 lynx ws coleco ngp doom mame arcade swf html5`

内置播放器：EmulatorJS（核心 FCEUmm、Gambatte、mGBA、Genesis Plus GX、Snes9x、Mednafen PCE/WonderSwan/NGP、Stella、ProSystem、Handy、GearColeco、PrBoom、MAME 2003-Plus、FinalBurn Neo）和 Ruffle（Flash）。

## MAME 官方免费街机 ROM（需自己下载）
Robby Roto、Gridlee、Super Tank、Alien Arena、Exidy 系列等经典街机，版权方授权 MAME 官方网站免费提供（**仅限非商业用途**），但**不允许别人再打包分发**，所以本合集没有附带，只在大厅放了标着“需自行下载”的卡片。

1. 联网打开 https://www.mamedev.org/roms/ ，点进想玩的游戏，勾选同意“非商业用途”后下载 zip（例如 `robby.zip`）
2. **不要解压、不要改名**，直接放进本合集的 `my-roms/` 文件夹
3. 回到大厅点对应卡片即可开玩（使用内置的 MAME 2003-Plus 核心）；也可以用“打开我自己的游戏文件”直接选 zip（旁边的下拉框选“MAME 2003-Plus”）

已测试可在 MAME 2003-Plus 运行的 18 款：Alien Arena、Car Polo、Circus、Crash、FAX（开机会先做自检，稍等）、Fire One、Gridlee、Hard Hat、Rip Cord、Robby Roto、Robot Bowl、Side Trak、Spectar、Star Fire、Super Tank、Targ、Teeter Torture、Victory。
Looping、Top Gunner 以及 Video Klein 的扑克类（Witch 系列）在这个浏览器版核心里不支持，需要用电脑版 MAME（https://www.mamedev.org/release.html）运行。

## 目录
`index.html` 大厅 · `play.html` 播放页 · `games.json` 游戏清单 · `roms/` 游戏 ROM · `html5/` 网页游戏 · `emulatorjs/` `ruffle/` 播放器 · `covers/` 封面截图 · `licenses/` 许可证原文
