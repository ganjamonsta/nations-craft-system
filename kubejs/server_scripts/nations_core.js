// priority: 10
// Nations Core - Server Script
// Handles: scoreboard teams (prefixes), GameStage sync, crafting restrictions
// ==========================================================================

// ==========================================================================
// Nation Definitions
// ==========================================================================
const NATIONS = {
  scandinavia: { name: 'Скандинавия',  prefix: 'SCAN', color: 'blue',         group: 'nordic_slavic'  },
  byzantium:   { name: 'Византия',    prefix: 'BYZ',  color: 'dark_purple',  group: 'byzantium'      },
  saracens:    { name: 'Сарацины',    prefix: 'SAR',  color: 'green',        group: 'saracens'       },
  germany:     { name: 'Германия',    prefix: 'GER',  color: 'dark_gray',    group: 'western_europe' },
  england:     { name: 'Англия',      prefix: 'ENG',  color: 'red',          group: 'western_europe' },
  france:      { name: 'Франция',     prefix: 'FRA',  color: 'aqua',         group: 'western_europe' },
  rus:         { name: 'Русь',        prefix: 'RUS',  color: 'gold',         group: 'nordic_slavic'  },
  mongolia:    { name: 'Монголия',    prefix: 'MON',  color: 'dark_red',     group: 'eastern_asia'   },
  china:       { name: 'Китай',       prefix: 'CHN',  color: 'yellow',       group: 'eastern_asia'   },
  korea:       { name: 'Корея',       prefix: 'KOR',  color: 'white',        group: 'eastern_asia'   },
  japan:       { name: 'Япония',      prefix: 'JPN',  color: 'light_purple', group: 'japan'          },
  greece:      { name: 'Греция',      prefix: 'GRC',  color: 'dark_aqua',    group: 'greece'         },
  rome:        { name: 'Рим',         prefix: 'ROM',  color: 'dark_green',   group: 'rome'           },
  egypt:       { name: 'Египет',      prefix: 'EGY',  color: 'gray',         group: 'egypt'          }
};

// ==========================================================================
// Crafting Groups - nations sharing the same craft recipes
// Groups that share identical crafting permissions:
//   western_europe: Germany, England, France  (Epic Knights + golden armor addon)
//   eastern_asia:   China, Mongolia, Korea
//   nordic_slavic:  Scandinavia, Rus
//   Individual:     Byzantium, Saracens, Japan, Greece, Rome, Egypt
// ==========================================================================
const CRAFT_GROUPS = {
  western_europe: ['germany', 'england', 'france'],
  eastern_asia:   ['china', 'mongolia', 'korea'],
  nordic_slavic:  ['scandinavia', 'rus'],
  byzantium:      ['byzantium'],
  saracens:       ['saracens'],
  japan:          ['japan'],
  greece:         ['greece'],
  rome:           ['rome'],
  egypt:          ['egypt']
};

// ==========================================================================
// Allowed crafts per group (vanilla workbench only)
// FORMAT: group_name -> array of item IDs that ARE allowed
// TODO: Fill in once client provides the specific recipe/item lists
// ==========================================================================
const ALLOWED_CRAFTS = {
  // western_europe: [
  //   'epicknights:golden_helmet',
  //   'epicknights:golden_chestplate',
  //   ...
  // ],
  // eastern_asia: [ ... ],
  // nordic_slavic: [ ... ],
  // byzantium: [ ... ],
  // saracens: [ ... ],
  // japan: [ ... ],
  // greece: [ ... ],
  // rome: [ ... ],
  // egypt: [ ... ]
};

// ==========================================================================
// Helper: get player's nation from GameStages
// ==========================================================================
function getPlayerNation(player) {
  let nationIds = Object.keys(NATIONS);
  for (let i = 0; i < nationIds.length; i++) {
    let nationId = nationIds[i];
    if (player.stages.has('nation_' + nationId)) {
      return nationId;
    }
  }
  return null;
}

// ==========================================================================
// Helper: get craft group for a nation
// ==========================================================================
function getCraftGroup(nationId) {
  if (!nationId || !NATIONS[nationId]) return null;
  return NATIONS[nationId].group;
}

// ==========================================================================
// Server Load - Create scoreboard teams for nation prefixes
// ==========================================================================
ServerEvents.loaded(event => {
  let server = event.server;

  let nationIds = Object.keys(NATIONS);
  for (let i = 0; i < nationIds.length; i++) {
    let nationId = nationIds[i];
    let nation = NATIONS[nationId];
    let teamName = 'nation_' + nationId;

    server.runCommandSilent('team add ' + teamName);
    
    // Use translatable prefix - will adapt to player's language
    let prefixColor = nation.color;
    let prefixKey = 'nations.prefix.' + nationId;
    
    // Create prefix with translatable component
    let prefixJson = '{"translate":"' + prefixKey + '","fallback":"' + nation.prefix + '","color":"' + prefixColor + '"}';
    let fullPrefix = '{"text":"[","color":"white"},{"translate":"' + prefixKey + '","fallback":"' + nation.prefix + '","color":"' + prefixColor + '"},{"text":"] ","color":"white"}';
    
    server.runCommandSilent(
      'team modify ' + teamName + ' prefix ' + fullPrefix
    );
    server.runCommandSilent('team modify ' + teamName + ' color ' + prefixColor);
  }

  console.info('[Nations] Initialized ' + nationIds.length + ' nation teams with i18n prefixes');
});

// ==========================================================================
// Player Login - Ensure GameStage and team are synced
// The origin power handles initial assignment, this is a safety net
// ==========================================================================
PlayerEvents.loggedIn(event => {
  let player = event.player;
  let nation = getPlayerNation(player);

  if (nation) {
    let teamName = 'nation_' + nation;
    player.server.runCommandSilent('team join ' + teamName + ' ' + player.username);
    console.info('[Nations] ' + player.username + ' synced to nation: ' + nation);
  } else {
    console.info('[Nations] ' + player.username + ' has no nation yet (awaiting selection)');
  }
});

// ==========================================================================
// Crafting Restriction - Block crafts not allowed for the player's nation
// Applies ONLY to vanilla crafting table (minecraft:crafting)
// TODO: Activate once ALLOWED_CRAFTS is populated with data from client
// ==========================================================================
// PlayerEvents.crafted(event => {
//   let player = event.player;
//   let item = event.item;
//   let nationId = getPlayerNation(player);
//
//   if (!nationId) return;
//
//   let group = getCraftGroup(nationId);
//   if (!group) return;
//
//   let allowed = ALLOWED_CRAFTS[group];
//   if (!allowed) return;
//
//   let itemId = item.id;
//   if (allowed.indexOf(itemId) === -1) {
//     // Item not in allowed list - deny the craft
//     item.count = 0;
//     player.tell(
//       Text.of('§cВаша нация не может крафтить этот предмет!')
//     );
//   }
// });

console.info('[Nations] Server scripts loaded');
