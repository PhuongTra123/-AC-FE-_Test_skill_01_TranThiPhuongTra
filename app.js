const readline = require('readline');

const nationsData = require('./nations.json');
const teamsData = require('./teams.json');
const playersData = require('./players.json');

const SEARCH = '1';
const SEARCH_FIELD = '2'

let currentState = 'init';
let searchOption = '';
let selectValue = '';
let selectNumber = '';
let searchTerm = '';
let searchValue = '';

const displayInitialMessage = () => {
    console.log("\nType 'quit' to exit at any time. Press 'Enter' to continue");
}

const handleUserInput = (input) => {
    if (input.trim().toLowerCase() === 'quit') {
        console.log('Exiting...');
        process.exit(0);
    }

    switch (currentState) {
        case 'init':
            if (input === '') {
                currentState = 'searchOptions';

                console.log('\nSelect search options:');
                console.log('Press 1 to search');
                console.log('Press 2 to view a list of searchable fields');
                console.log("Type 'quit' to exit");
            }
            break;
        case 'searchOptions':
            if (input === '1' || input === '2') {
                searchOption = input;
                currentState = 'selectValue';
                console.log('\nSelect 1: Players or 2: Teams or 3: Nations');
            }
            break;
        case 'selectValue':
            if (input === '1' || input === '2' || input === '3') {
                selectNumber = input;
                selectValue = getInputData(input);
                if (searchOption === SEARCH) {
                    currentState = 'searchTerm';
                    console.log('\nEnter search term:');
                } else if (searchOption === SEARCH_FIELD) {
                    console.log('\n=> Results:');
                    console.log(`Search ${getInputName(selectNumber)} with:`);
                    const list = getInputData(selectNumber)
                    const keys = Object.keys(list[0]);
                    for (let key of keys) {
                        console.log(key);
                    }
                    console.log("\nType 'quit' to exit at any time. Press 'Enter' to continue");
                    resetData()
                }
            }
            break;
        case 'searchTerm':
            if (input !== '') {
                searchTerm = input;
                console.log('\nEnter search value: ');
                currentState = 'searchValue';
            }
            break;
        case 'searchValue':
            if (input !== '') {
                searchValue = input;
                currentState = 'result';
                console.log('\n=> Results:');
                const result = searchData(selectValue, searchTerm, searchValue);
                console.log(result);
                if (result?.length === 0) console.log('No item');
                console.log("\nType 'quit' to exit at any time. Press 'Enter' to continue");
                resetData()
            }
            break;
    }
}

const getInputData = (input) => {
    if (input === '1') return playersData;
    if (input === '2') return teamsData;
    if (input === '3') return nationsData;
}

const getInputName = (input) => {
    if (input === '1') return 'Players';
    if (input === '2') return 'Teams';
    if (input === '3') return 'Nations';
}

const resetData = () => {
    currentState = 'init'
    searchOption = '';
    selectValue = '';
    selectNumber = '';
    searchTerm = ''
    searchValue = ''
}

const searchData = (data, fieldName, fieldValue) => {
    const result = data.filter(item => `${item[fieldName]}` === fieldValue);

    if (result.length === 0) return '';

    if (selectNumber === '1') {
        return result.map(item => {
            const team = teamsData.find(i => i._id === item.team_id);
            const nation = nationsData.find(i => i._id === item.nation_id);
            return { ...item, teamValue: team?.value, teamName: team?.name, nationValue: nation?.value, nationName: nation?.name };
        });
    } else if (selectNumber === '2') {
        return result.map(item => {
            const nation = nationsData.find(i => i._id === item.nation_id);
            const players = playersData.filter(i => i.team_id === item._id).map(i => i.name);
            return { ...item, nationValue: nation?.value, nationName: nation?.name, players };
        });
    } else if (selectNumber === '3') {
        const itemNation = data.find(item => `${item[fieldName]}` === fieldValue);
        const teams = teamsData.filter(i => i.nation_id === itemNation?._id).map(i => i.name);
        const players = playersData.filter(i => i.nation_id === itemNation?._id).map(i => i.name);
        return { ...itemNation, teams, players };
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

displayInitialMessage();

rl.on('line', handleUserInput);