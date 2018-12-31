const inquirer = require('inquirer');
const columnify = require('columnify');
const playerSearch = require('../functions/playerSearch.js');
const seasonStats = require('../functions/seasonStats.js');
//****************************************************************************************************
// QUICK FUNCTIONS
//****************************************************************************************************
// I found myself re-using this code a lot so I just made them quick little functions instead.
//----------------------------------------------------------------------------------------------------

const quickColumn = (data) => {
  let columns = columnify(data, {
    columnSplitter: '__|__',
    paddingChr: '_'
  });
  return columns;
};

module.exports.quickColumn = quickColumn;
//----------------------------------------------------------------------------------------------------

const quickNameLookup = (name) => {
  playerSearch.playerSearch(name, 'Y', player => {
    let columns = quickColumn(player);
    console.log('***********************************')
    console.log(`******* ${player.name} Info **********`)
    console.log('***********************************')
    console.log(columns);
    quickStatsLookup(player);
  });
}
module.exports.quickNameLookup = quickNameLookup;

//----------------------------------------------------------------------------------------------------

const quickStatsLookup = (player) => {
  inquirer
    .prompt([{
        type: 'input',
        name: 'season',
        message: 'Enter the year (format: YYYY) of the season you want stats for',
        validate: validateYear
      },
      {
        type: 'list',
        name: 'game_type',
        message: 'Choose the game type you want stats for',
        choices: ['Regular Season', 'World Series', 'League Championship', 'First Round (Wild Card)', 'Division Series', 'Spring Training'],
        filter: gameTypeFilter
      }
    ]).then(answer => {
      player.position === 'P' ?
        quickPitchingLookup(answer, player.player_id) :
        quickHittingLookup(answer, player.player_id);
    })
}

module.exports.quickStatsLookup = quickStatsLookup;

//----------------------------------------------------------------------------------------------------

const quickHittingLookup = (answer, player_id) => {
  seasonStats.seasonHittingStats(player_id, answer.season, answer.game_type, stats => {
    quickPlayerStats(player_id, stats, answer.season);
  });
}

module.exports.quickHittingLookup = quickHittingLookup;

//----------------------------------------------------------------------------------------------------

const quickPitchingLookup = (answer, player_id) => {
  seasonStats.seasonPitchingStats(player_id, answer.season, answer.game_type, stats => {
    quickPlayerStats(player_id, stats, answer.season);
  });
}

module.exports.quickPitchingLookup = quickPitchingLookup;

//----------------------------------------------------------------------------------------------------

const quickPlayerStats = (player_id, stats, season, currentMenu) => {
  playerSearch.playerLookup(player_id, data => {
    currentMenu = currentMenu ? currentMenu : data.position === 'P' ? 'Pitching' : 'Hitting'
    let position = data.position === 'P' ? 'Pitching' : 'Hitting'
    let columns = quickColumn(stats)
    console.log('****************************************************************')
    console.log(`****** ${data.name}'s ${currentMenu} Statistics for ${season} ******`)
    console.log('****************************************************************')
    console.log(columns);
  });
}

module.exports.quickPlayerStats = quickPlayerStats;

//----------------------------------------------------------------------------------------------------

const validateYear = (year) => {
  const reg = /^\d{4,4}\b/;
  return reg.test(year) || "Please Enter a Valid Year (Format: YYYY)."
}

module.exports.validateYear = validateYear;

//----------------------------------------------------------------------------------------------------

const validateResults = (results) => {
  const reg = /^\d+\b/;
  return reg.test(results) || 'Please Enter a Number'
}
module.exports.validateResults = validateResults;

//----------------------------------------------------------------------------------------------------

const gameTypeFilter = (game_type) => {
  switch (game_type) {
    case 'Regular Season':
      return 'R'
    case 'World Series':
      return 'W'
    case 'League Championship':
      return 'L'
    case 'First Round (Wild Card)':
      return 'F'
    case 'Division Series':
      return 'D'
    case 'Spring Training':
      return 'S'
  }
}

module.exports.gameTypeFilter = gameTypeFilter;
//----------------------------------------------------------------------------------------------------

const sortColumnFilter = (sort_column) => {
  switch (sort_column) {
    case 'Home Runs':
      return 'hr'
    case 'Batting Average':
      return 'avg'
    case 'Hits':
      return 'h'
    case 'Earned Run Average':
      return 'era'
    case 'Walks and Hits Per Innings Pitched':
      return 'whip'
    case 'Strikeouts':
      return 'so'
    case 'Walks':
      return 'bb'
    case 'Strikeout/Walk Ratio':
      return 'k_bb'
  }
}

module.exports.sortColumnFilter = sortColumnFilter;

//----------------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------------
