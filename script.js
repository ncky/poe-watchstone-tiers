const inputText = `
Tier 1
Bone Crypt
Pier
Flooded Mine
Glacier

Tier 2
Dunes
Infested Valley
Port
Forking River
Laboratory
Fields
Crimson Township
Core

Tier 3
Overgrown Shrine
Strand
Ancient City
Estuary
Chateau
Ramparts
Conservatory
Castle Ruins

Tier 4
Cemetery
Moon Temple
Vaal Pyramid
Lookout
Colonnade
Precinct
Grotto
Acid Caverns

Tier 5
Atoll
Courtyard
Gardens
Academy
Dry Sea
Siege
Tropical Island
Ashen Wood

Tier 6
Shore
Promenade
Waste Pool
Palace
Dark Forest
Crystal Ore
Thicket

Tier 7
Cursed Crypt
Relic Chambers
Plateau
Caldera
Dig
Bog
Frozen Cabins

Tier 8
Arachnid Nest
Wasteland
Spider Forest
Overgrown Ruin
Grave Trough
Summit
City Square

Tier 9
Foundry
Sepulchre
Park
Spider Lair
Channel
Iceberg

Tier 10
Underground Sea
Crater
Arena
Wharf
Carcass
Coves

Tier 11
Ghetto
Arcade
Mineral Pools
Racecourse
Burial Chambers
Volcano

Tier 12
Museum
Necropolis
Orchard
Colosseum
Basilica
Lava Chamber

Tier 13
Mud Geyser
Arid Lake
Crimson Temple
Cage
Canyon

Tier 14
Temple
Maze
Reef
Jungle Valley
Plaza

Tier 15
Underground River
Ivory Temple
Vault
Mesa
Bramble Valley

Tier 16
Desert
Residence
Bazaar
Stagnation
`;

function initPage() {
    const newDataInput = document.getElementById('newDataInput');
    newDataInput.value = inputText;
    loadNewData();
}

// Function to toggle visibility of tiers under 14
function toggleTiers() {
    const hideTiersUnder14 = document.getElementById('hideTiersUnder14').checked;
  
    for (let j = 1; j <= 16; j++) {
      const column = document.querySelectorAll(`#mapTable td:nth-child(${j + 1})`);
  
      column.forEach(cell => {
        const tier = parseInt(cell.parentElement.cells[0].textContent.split(' ')[1]);
  
        if (hideTiersUnder14 && tier < 14) {
          cell.style.display = 'none';
        } else {
          cell.style.display = '';
        }
      });
    }
    //hide tier labels too
    for (let j = 1; j <= 16; j++) {
        const column = document.querySelectorAll(`#mapTable td:nth-child(${1})`);
    
        column.forEach(cell => {
          const tier = parseInt(cell.parentElement.cells[0].textContent.split(' ')[1]);
    
          if (hideTiersUnder14 && tier < 14) {
            cell.style.display = 'none';
          } else {
            cell.style.display = '';
          }
        });
      }

  }
  

// Function to load new data and replace the table
function loadNewData() {
    console.log('Loading new data')
    const newDataInput = document.getElementById('newDataInput');
    const newInputText = newDataInput.value;
    newDataInput.value = '';

    // Split the text into tiers
    const tiers = inputText.split("Tier").slice(1);

    // Initialize the dictionary
    const newMap = {};

    const maxStones = 3

    // Iterate through each tier
    tiers.forEach((tier, index) => {
    // Split the tier text into lines
    const lines = tier.trim().split('\n');

    // Extract the tier number
    const baseTier = parseInt(lines[0].trim(), 10);

    // Iterate through each map name in the tier
    for (let i = 1; i < lines.length; i++) {
        const mapName = lines[i].trim();
        // Add the map to the dictionary with the corresponding base tier number
        newMap[mapName] = baseTier;
    }
    });
    console.log(newMap);
    // Define the watchstone effects
    const watchstoneEffects = {
        0: 0,
        1: 3,
        2: 7,
        3: 11,
        4: 15,
    };
    // Create an object to store maps for each combination of watchstones
    const newMapsByWatchstones = {};

    // Iterate through each watchstone amount
    for (let i = 0; i <= maxStones; i++) {
        // Iterate through each tier
        for (let j = 1; j <= 16; j++) {
        const tierMaps = Object.keys(newMap).filter(mapName => {
            const adjustedTier = Math.min(newMap[mapName] + watchstoneEffects[i], 16);
            return adjustedTier === j;
        });

        if (tierMaps.length > 0) {
            if (!newMapsByWatchstones[i]) {
            newMapsByWatchstones[i] = {};
            }

            newMapsByWatchstones[i][j] = tierMaps;
        }
        }
    }

    // Replace the existing table with the new one
    const existingTable = document.getElementById('mapTable');
    const newTable = existingTable.cloneNode(false); // Clone without children

    // Create new header row
    const newHeaderRow = newTable.insertRow();
    newHeaderRow.insertCell().textContent = 'Map Tier';

    for (let i = 0; i <= maxStones; i++) {
        newHeaderRow.insertCell().textContent = `With ${i} Watchstones`;
    }

    // Iterate through each tier and display maps in their respective columns
    for (let j = 1; j <= 16; j++) {
        const row = newTable.insertRow();

        const mapNameCell = row.insertCell();
        mapNameCell.textContent = `Tier ${j}`;

        for (let i = 0; i <= maxStones; i++) {
        const cell = row.insertCell();
        cell.textContent = newMapsByWatchstones[i] && newMapsByWatchstones[i][j]
            ? newMapsByWatchstones[i][j].join(', ')
            : '';
        }
    }

    // Replace the existing table with the new one
    existingTable.parentNode.replaceChild(newTable, existingTable);
    toggleTiers()
}


initPage();
