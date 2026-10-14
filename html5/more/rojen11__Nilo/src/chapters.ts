export type ch = {
  colors: { [key: string]: string | Array<string> };
};

export interface Chapters {
  [key: string]: ch;
}

export const chapters: Chapters = {
  '1': {
    colors: {
      background: '#F1F9CB',
      player: '#4285f4',
      platform: '#fbbc05',
      spike: '#fbbc05',
      jumppad: '#fbbc05',
      end: '#34a853',
      nonplatform: '#ea4335',
      nonspike: '#ea4335',
      endscreencolors: ['#4285f4', '#fbbc05', '#34a853', 'ea4335'],
    },
  },
  '2': {
    colors: {
      background: '#292929',
      player: '#ffa31a',
      platform: '#ffffff',
      spike: '#ffffff',
      jumppad: '#ffffff',
      end: '#ffa31a',
      nonplatform: '#808080',
      nonspike: '#808080',
    },
  },
};
