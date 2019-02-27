const fs = require('fs');
const chalk = require('chalk');

const dataDir = './data';

const getSourceData = (sourceFilePath) => {
    return JSON.parse(fs.readFileSync(sourceFilePath, 'utf8'));
};
// --- Get all data from the file system
const teamsControlData = [];
fs.readdirSync(dataDir).forEach(fileName => {
  const path = `${dataDir}/${fileName}`;
  let fileData = getSourceData(path);
  teamsControlData.push(fileData);
});

// --- Create a map of the controls
const controls = {};
let latestDate = '02/1/19';  // Fake starter date
const teamsReported = [];

teamsControlData.forEach((teamData, i) => {
    if (teamData.date > latestDate) {
        latestDate = teamData.date;
    }

    teamsReported.push(teamData.team);

    teamData.muiControls.forEach((control, i) => {
        const doesNotExist = !controls[control];
        if (doesNotExist) {
            controls[control] = { 
                name: control,
                teams: [],
                modules: [] 
            };            
        }
        controls[control].teams.push(teamData.team);
        controls[control].modules.push(teamData.module);
    });
    // Pseudo code of the object shape:
    // controls["Button"] = {
    //     name: "Button",
    //     teams: ["EPSG", "Bald Eagles"], // counts will be computed
    //     modules: ["GIS", "Inventory"]
    // }
});

console.log(`--------------------------------------`);
console.log(`MUI control usage as of ${latestDate}\n`);
console.log(`Teams reported: ${teamsReported.join(', ')}\n`);

Object.keys(controls).sort().forEach((controlName) => {
    console.log(''); // newline
    console.log(`CONTROL: ${controlName}`);
    const moduleStr = `MODULES: ${controls[controlName].modules.join(', ')}`;
    console.log(chalk.gray(moduleStr));    
});

console.log(' ');
