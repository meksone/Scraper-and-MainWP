function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('⭐ Scraper Menu')
      .addSeparator()
      .addItem('Run Scraper! ☢️', 'letsCheck')
      .addSeparator()
      .addItem('Get All Sites! 🌐', 'getAllSites')
      .addSeparator()
      .addItem('Get All Plugins! ⚠️', 'getAllPlugins')
      .addToUi();
}

/**
 * Cheerio XML/HTML parser/scraper
 * https://github.com/tani/cheeriogs?tab=readme-ov-file 
 * 1ReeQ6WO8kKNxoaA_O0XEQ589cIrRvEBA9qcWpNqdOP17i47u6N9M5Xh0
 */

/**
 * Globals
 */

function createGlobals(){
const sheetObj = SpreadsheetApp.getActiveSpreadsheet();
const activeSheetName = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName();
SpreadsheetApp.getUi().alert( 'Active sheet is ' + activeSheetName );

const sheetData = mkHelpers.readRange(sheetObj,activeSheetName); // for cleanData
const cleanData = mkHelpers.getCleanData(sheetData); // object array
const singleSheetObj = sheetObj.getSheetByName(activeSheetName); // for setSingleValue

// output objects in a single variable
const result = [];
result.push( { cleanData, singleSheetObj } ); // variable object, multi valued

return result;
Logger.log( "Global options and variables created" );
}



function letsCheck(){
Logger.log( "Getting globals" );
const globals = createGlobals();
Logger.log( "Scraping started" );
let results = [];

globals[0].cleanData.forEach(function(data,index){ // Main Loop
if(data.enabled){

let checkTime = mkHelpers.whatTimeIsNow(); 
let link = data.link; // URL to check
let searchKey = data.selector; // selector to find
let fullPage = getContent_(link); // the full HTML page

if (fullPage[0]) {
fullPage = fullPage[1]
} else {
  mkHelpers.setSingleValue( globals[0].singleSheetObj, index, 6, checkTime); // check time
mkHelpers.setSingleValue( globals[0].singleSheetObj, index, 7, fullPage[1]); // check status
return

}

let content = Cheerio.load(fullPage); // Loaded in Cheerio

// let's check different types

let rawValue = "";

if (data.type == 'attr') {
let innerrawValue = content( searchKey ).attr(data.value);
rawValue = innerrawValue;
}

if (data.type == 'text') {
let innerrawValue = content( searchKey ).text();
let cleanTitle = innerrawValue.trim();
rawValue = cleanTitle;
}

if(compareValues_( data.title, rawValue )){
Logger.log("Nothing is changed since last check");
results.push({'oldvalue':data.title,
                'newvalue':rawValue,
                'changed':false,
                'lastcheck': checkTime});
mkHelpers.setSingleValue( globals[0].singleSheetObj, index, 6, checkTime); // check time
mkHelpers.setSingleValue( globals[0].singleSheetObj, index, 7, "Not Updated"); // check status
} else {
Logger.log("Value changed, update sheet - old value: " + data.title + " - new value: " + rawValue);
results.push({'oldvalue':data.title,
                'newvalue':rawValue,
                'changed':true,
                'lastcheck': checkTime});
mkHelpers.setSingleValue( globals[0].singleSheetObj, index, 5, rawValue); // new title
mkHelpers.setSingleValue( globals[0].singleSheetObj, index, 6, checkTime); // check time
mkHelpers.setSingleValue( globals[0].singleSheetObj, index, 7, "Updated"); // check status
}
} else {
  //not enabled
  Logger.log("Row is not enabled!")
}
}) // END FOREACH

} // END
