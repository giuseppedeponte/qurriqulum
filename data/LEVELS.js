'use strict';
tMap: var LEVELS = [{
  title: 'NIVEAU 1',
  subtitle: 'Développement JS',
  player: {
    firstTile: {
      x: 0,
      y: 0
    }
  },
  monster: {
    imgSrc: 'monster.png'
  },
  tMap: {
    oX: 400,
    oY: 200,
    tileSize: 40,
    target: 1,
    map: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0],
      [0, 0],
      [0]
    ],
    colors: {
      left: '#4C6A8D',
      right: '#0C9DA9',
      base: [
        '#FBC38D',
        '#F8555E'
      ],
      target: '#F8555E'
    }
  }
},{
  title: 'NIVEAU 2',
  subtitle: 'Vente de détail | Conseil clients',
  player: {
    firstTile: {
      x: 0,
      y: 0
    }
  },
  monster: {
    imgSrc: 'monster.png'
  },
  tMap: {
    oX: 400,
    oY: 160,
    tileSize: 40,
    target: 1,
    map: [
      [0, 0, 0, 0],
      [0, '', '', 0],
      [0, '', '', 0],
      [0, '', '', 0],
      [0, 0, 0, 0]
    ],
    colors: {
      left: '#31405A',
      right: '#49728C',
      base: [
        '#7EABC2',
        '#ADD1D9'
      ],
      target: '#ADD1D9'
    }
  }
},{
  title: 'NIVEAU 3',
  subtitle: 'Cinéma',
  player: {
    firstTile: {
      x: 0,
      y: 0
    }
  },
  monster: {
    imgSrc: 'monster.png'
  },
  tMap: {
    oX: 400,
    oY: 200,
    tileSize: 40,
    target: 2,
    map: [
      [0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1],
      [0, 1, 0, 1],
      [1, 0, 1],
      [0, 1],
      [1]
    ],
    colors: {
      left: '#888',
      right: '#777',
      base: [
        '#666',
        '#444',
        '#222'
      ],
      target: '#222'
    }
  }
},{
  title: 'NIVEAU 4',
  subtitle: 'Écriture',
  player: {
    firstTile: {
      x: 0,
      y: 0
    }
  },
  monster: {
    imgSrc: 'monster.png'
  },
  tMap: {
    oX: 400,
    oY: 200,
    tileSize: 40,
    target: 2,
    map: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0],
      [0, 0],
      [0]
    ],
    colors: {
      left: '#513C43',
      right: '#874455',
      base: [
        '#C34E54',
        '#E67359',
        'gold'
      ],
      target: 'gold'
    }
  }
}];
