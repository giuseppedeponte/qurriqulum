"use strict";
var CONFIG = {};
CONFIG.levels = [
  {
    title: "NIVEAU 1",
    subtitle: "Développement web",
    details: [
      "Full stack : JavaScript, React, NodeJS, Python, SQL, HTML/CSS, ...",
      "\u2766",
      "2020—2024 : responsable des outils numériques @ La France insoumise, Paris",
      "2017—2020 : développeur full-stack JS @ FoodChéri, Paris",
      "2017 : Formation développeur full-stack JavaScript @ IFOCOP, Paris"
    ],
    background: "code.gif",
    overlay: "none",
    player: {
      firstTile: {
        x: 0,
        y: 0
      }
    },
    monster: {
      imgSrc: "bug.png"
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
        left: "#4C6A8D",
        right: "#0C9DA9",
        base: ["#FBC38D", "#F8555E"],
        target: "#F8555E"
      }
    }
  },
  {
    title: "NIVEAU 2",
    subtitle: "Conseil clients | Vente au détail",
    details: [
      "[ conseil clients, encaissement, gestion de rayons, logistique, inventaires, marchandisage, ... ]",
      "\u2766",
      "2010-2017 : Conseiller de vente @ Le Géant des Beaux-Arts, Paris"
    ],
    background: "store.gif",
    overlay: "none",
    player: {
      firstTile: {
        x: 0,
        y: 0
      }
    },
    monster: {
      imgSrc: "dali.png"
    },
    tMap: {
      oX: 400,
      oY: 140,
      tileSize: 40,
      target: 1,
      map: [
        [0, 0, 0, 0],
        [0, "", "", 0],
        [0, "", "", 0],
        [0, "", "", 0],
        [0, 0, 0, 0]
      ],
      colors: {
        left: "#31405A",
        right: "#49728C",
        base: ["#7EABC2", "#ADD1D9"],
        target: "#ADD1D9"
      }
    }
  },
  {
    title: "NIVEAU 3",
    subtitle: "Cinéma",
    details: [
      "[ théorie & histoire du cinéma, écriture cinématographique, montage audio-vidéo ]",
      "\u2766",
      "2007 : Licence en D.A.M.S., option cinéma @ Université de Turin",
      "2006 : Assistant à la production théâtrale @ Laboratorio Sperimentale di Ricerca sull'Arte dell'attore, Turin",
      "2005 : Réalisateur/Monteur vidéo @ Piemonte Groove, Turin"
    ],
    background: "cine.gif",
    overlay: "block",
    player: {
      firstTile: {
        x: 0,
        y: 0
      }
    },
    monster: {
      imgSrc: "m.png"
    },
    tMap: {
      oX: 400,
      oY: 200,
      tileSize: 40,
      target: 2,
      map: [
        [0, 0, 0, 0, 0, 0],
        [0, "", 1, 1, 0],
        [0, 1, 1, 0],
        [0, 1, 0],
        [0, 0],
        [0]
      ],
      colors: {
        left: "#bbb",
        right: "#aaa",
        base: ["#444", "#666", "#888"],
        target: "#888"
      }
    }
  },
  {
    title: "NIVEAU 4",
    subtitle: "Écriture",
    details: [
      "langues: [ italien, français, anglais ]",
      "\u2766",
      "2009 : Formation de langue française écrite @ Aleph Écriture, Paris",
      "2008-2010 : Story Editor @ Affabula Readings, Turin",
      "2008 : Master en écritures pour le cinéma : Scénario et Critique @ Université de Udine"
    ],
    background: "laptop.gif",
    overlay: "none",
    player: {
      firstTile: {
        x: 0,
        y: 0
      }
    },
    monster: {
      imgSrc: "evilMe.png"
    },
    tMap: {
      oX: 400,
      oY: 150,
      tileSize: 30,
      target: 3,
      map: [
        [1, 1, 1, 1, 1, 1, 1, 1, 2],
        [0, "", "", 2, 2, "", "", 2, ""],
        [0, "", 2, 2, "", "", "", "", ""],
        [0, 2, 2, "", "", "", "", "", ""],
        [0, 2, "", "", "", "", "", "", ""],
        [0, "", "", "", "", "", "", "", ""],
        [0, "", "", "", "", "", "", "", ""],
        [0, 2, "", "", "", "", "", "", ""],
        [2, "", "", "", "", "", "", "", ""]
      ],
      colors: {
        left: "#513C43",
        right: "#874455",
        base: ["#C34E54", "#E67359", "gold", "wheat"],
        target: "wheat"
      }
    }
  }
];

CONFIG.assets = [
  "arcade.png",
  "bug.png",
  "cine.gif",
  "code.gif",
  "cubes.png",
  "dali.png",
  "demo.gif",
  "evilMe.png",
  "filmgrain.gif",
  "laptop.gif",
  "m.png",
  "player.png",
  "store.gif"
];
