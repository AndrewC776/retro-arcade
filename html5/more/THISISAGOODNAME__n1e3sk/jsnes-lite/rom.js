var ROM = function (nes) {
  this.nes = nes;
};

ROM.prototype = {
  header: null,
  rom: null,
  vrom: null,
  vromTile: null,

  romCount: null,
  vromCount: null,
  mirroring: null,
  trainer: null,
  mapperType: null,
  valid: false,

  load: function (data) {
    var i, j, v;

    if (data.indexOf("NES\x1a") === -1) {
      throw new Error("Not a valid NES ROM.");
    }
    this.header = new Array(16);
    for (i = 0; i < 16; i++) {
      this.header[i] = data.charCodeAt(i) & 0xff;
    }
    this.romCount = this.header[4];
    this.vromCount = this.header[5] * 2; // Get the number of 4kB banks, not 8kB
    this.mirroring = (this.header[6] & 1) !== 0 ? 1 : 0;
    // batteryRam flag ignored
    this.trainer = (this.header[6] & 4) !== 0;
    this.mapperType = (this.header[6] >> 4) | (this.header[7] & 0xf0);
    // Check whether byte 8-15 are zero's:
    var foundError = false;
    for (i = 8; i < 16; i++) {
      if (this.header[i] !== 0) {
        foundError = true;
        break;
      }
    }
    if (foundError) {
      this.mapperType &= 0xf; // Ignore byte 7
    }
    // Load PRG-ROM banks:
    this.rom = new Array(this.romCount);
    var offset = 16;
    for (i = 0; i < this.romCount; i++) {
      this.rom[i] = new Array(16384);
      for (j = 0; j < 16384; j++) {
        if (offset + j >= data.length) {
          break;
        }
        this.rom[i][j] = data.charCodeAt(offset + j) & 0xff;
      }
      offset += 16384;
    }
    // Load CHR-ROM banks:
    this.vrom = new Array(this.vromCount);
    for (i = 0; i < this.vromCount; i++) {
      this.vrom[i] = new Array(4096);
      for (j = 0; j < 4096; j++) {
        if (offset + j >= data.length) {
          break;
        }
        this.vrom[i][j] = data.charCodeAt(offset + j) & 0xff;
      }
      offset += 4096;
    }

    // Create VROM tiles:
    this.vromTile = new Array(this.vromCount);
    for (i = 0; i < this.vromCount; i++) {
      this.vromTile[i] = new Array(256);
      for (j = 0; j < 256; j++) {
        this.vromTile[i][j] = new Tile();
      }
    }

    // Convert CHR-ROM banks to tiles:
    var tileIndex;
    var leftOver;
    for (v = 0; v < this.vromCount; v++) {
      for (i = 0; i < 4096; i++) {
        tileIndex = i >> 4;
        leftOver = i % 16;
        if (leftOver < 8) {
          this.vromTile[v][tileIndex].setScanline(
            leftOver,
            this.vrom[v][i],
            this.vrom[v][i + 8],
          );
        } else {
          this.vromTile[v][tileIndex].setScanline(
            leftOver - 8,
            this.vrom[v][i - 8],
            this.vrom[v][i],
          );
        }
      }
    }

    this.valid = true;
  },

  getMirroringType: function () {
    if (this.mirroring === 0) {
      return 1;
    }
    return 0;
  },

  createMapper: function () {
    if (typeof Mappers[this.mapperType] !== "undefined") {
      return new Mappers[this.mapperType](this.nes);
    } else {
      throw new Error(
        "Only mappers 0-4 supported, rom is " +
          "Mapper (" +
          this.mapperType +
          ")",
      );
    }
  },
};

