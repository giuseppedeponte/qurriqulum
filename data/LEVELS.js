'use strict';
tMap: var LEVELS = [{
  title: 'NIVEAU 1',
  subtitle: 'Développement web',
  details: [
    '2017 : Formation Développeur full-stack JavaScript @ IFOCOP, Paris',
    '2014-2017 : Webmaster/Graphiste @ nicarali.com, Strasbourg',
    '2011-2017 : Développeur web autodidacte'
  ],
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
      [0, '', 0, 0, 0],
      [0, 0, '', 0],
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
  subtitle: 'Conseil clients | Vente au détail',
  details: [
    '2010-2017 : Conseiller de vente @ Le Géant des Beaux-Arts, Paris'
  ],
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
    oY: 140,
    tileSize: 40,
    target: 1,
    map: [
      [0, 0, 0, 0],
      [0, '', '', 0],
      [0, '', '', 0],
      [0, '', '', 0],
      [0, 0, 0, 0]
      /*
      ['', 0, 0, 0, 0],
      [0, '', 0, '', 0],
      [0, 0, 0, 0, 0],
      [0, '', 0, '', 0],
      [0, 0, 0, 0]
      */
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
  details: [
    '2007: Licence en Disciplines de l\'Art, de la Musique et du Spectacle @ Université de Turin',
    '2006: Assistant à la production théâtrale @ Laboratorio Sperimentale di Ricerca sull\'Arte dell\'attore, Turin',
    '2005: Réalisateur/Monteur vidéo @ Piemonte Groove, Turin'
  ],
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
      left: '#878',
      right: '#767',
      base: [
        '#656',
        '#434',
        '#212'
      ],
      target: '#222'
    }
  }
},{
  title: 'NIVEAU 4',
  subtitle: 'Écriture',
  details: [
    '2009: Formation de langue française écrite @ Aleph Écriture, Paris',
    '2008-2010: Story Editor @ Affabula Readings, Turin',
    '2008: Master en écritures pour le cinéma : Scénario et Critique @ Université de Udine'
  ],
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
    target: 3,
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
        'gold',
        'white'
      ],
      target: 'white'
    }
  }
}];
