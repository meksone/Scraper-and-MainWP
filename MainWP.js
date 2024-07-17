/**
 * Global Options
 */

const consumerKey = "ck_1d214d0c3eeb783d855b100a144463b0557cb097";
const consumerSecret = "cs_5ff18d1b1e28dda0f9ea08c9ecd013c7edbdd3fc";
const baseUrl = "https://dashboard.meks.one/wp-json/mainwp/v1/";


/**
 * Call API - generic
 * set method, endopoint and payload (optional)
 * 
 */
function callAPI(method, endpoint, payload) {
  //var baseUrl = "https://dashboard.meks.one/wp-json/mainwp/v1/";
  //var consumerKey = "ck_1d214d0c3eeb783d855b100a144463b0557cb097";
  //var consumerSecret = "cs_5ff18d1b1e28dda0f9ea08c9ecd013c7edbdd3fc";
  
  var url = baseUrl + endpoint + "consumer_key=" + consumerKey + "&consumer_secret=" + consumerSecret;
  
if(endpoint == "site/add-site") {
  url = baseUrl + endpoint
}

  var headers = {
    "Authorization": "Basic " + Utilities.base64Encode(consumerKey + ":" + consumerSecret)
  };
  
  var options = {
    "method": method,
    "muteHttpExceptions": true
  };
  
  if (payload) {
    //options["payload"] = JSON.stringify(payload);
    options["payload"] = (payload);
    headers["Content-Type"] = "application/json";
    
  }
  
  var response = UrlFetchApp.fetch(url, options);
  var statusCode = response.getResponseCode();
  var content = response.getContentText();
  
  // Handle the response based on the status code
  if (statusCode >= 200 && statusCode < 300) {
    // Successful response
    return JSON.parse(content);
  } else {
    // Error response
    throw new Error("API request failed. Status code: " + statusCode + ", Response: " + content);
  }
}


function testAPI() {
//var consumerKey = "ck_1d214d0c3eeb783d855b100a144463b0557cb097";
//var consumerSecret = "cs_5ff18d1b1e28dda0f9ea08c9ecd013c7edbdd3fc";

//var response = callAPI("GET", "sites/all-sites?");
var response = callAPI("GET", "site/site-installed-plugins?site_id=65&");
//var response = callAPI("GET", "site/site-inactive-plugins?site_id=65&");
//var response = callAPI("GET", "site/site-active-plugins?site_id=65&");

/*
var payload = {
    "url": 'https://crashtest.meks.one/wp-admin',
    "admin": 'crash-adm',
    "name": "CrashTest",
    "consumer_key": consumerKey,
    "consumer_secret": consumerSecret
}
var response = callAPI("POST", "site/add-site", payload);
*/

//write to spreadsheet
//writeObjectToSpreadsheet(response); // for objects made of other objects
writeArrayObjToSpreadsheet(response); // for arrays of objects

Logger.log("STOP");
}



function getAllSites() {
//var consumerKey = "ck_1d214d0c3eeb783d855b100a144463b0557cb097";
//var consumerSecret = "cs_5ff18d1b1e28dda0f9ea08c9ecd013c7edbdd3fc";

var response = callAPI("GET", "sites/all-sites?");

//write to spreadsheet
writeObjectToSpreadsheet(response); // for objects made of other objects

Logger.log("STOP");
}



function getAllPlugins() {
var consumerKey = "ck_1d214d0c3eeb783d855b100a144463b0557cb097";
var consumerSecret = "cs_5ff18d1b1e28dda0f9ea08c9ecd013c7edbdd3fc";
// Display a dialog box with a message, input field, and an "OK" button. The user can also
// close the dialog by clicking the close button in its title bar.
var ui = SpreadsheetApp.getUi();
var response = ui.prompt('Enter the site ID:');

// Process the user's response.
if (response.getSelectedButton() == ui.Button.OK) {
  Logger.log('The user\'s name is %s.', response.getResponseText());
var siteID = response.getResponseText();

} else {
  Logger.log('The user clicked the close button in the dialog\'s title bar.');
}

var endpoint = 'site/site-installed-plugins?site_id=' + siteID + '&'
var response = callAPI( "GET", endpoint );

// Write to the current Spreadsheet
writeArrayObjToSpreadsheet(response); // for arrays of objects

Logger.log("STOP");
}

function getPluginsForSite(siteId) {




}




/**
 * Sample Object
 * {
    "77": {
      "id": "77",
      "url": "https://adopta.cefla.it/",
      "name": "CPlace (Adopta Cefla)",
      "client_id": "2"
    },
    "83": {
      "id": "83",
      "url": "https://adopta.it/",
      "name": "Adopta",
      "client_id": "2"
    }
  };
 * 
 * 
 * 
 */
function writeObjectToSpreadsheet(object) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var keys = Object.keys(object);

  // Write column headers
  var headers = Object.keys(object[keys[0]]);
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Write data
  var data = keys.map(function(key) {
    return Object.values(object[key]);
  });
  sheet.getRange(2, 1, data.length, headers.length).setValues(data);
}

function writeArrayObjToSpreadsheet(objects) {

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (objects.length === 0) {
    throw new Error("The array of objects is empty.");
  }

  var keys = Object.keys(objects[0]);

  // Write column headers
  var headers = Object.keys(objects[0]);
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Write data
  var data = objects.map(function(object) {
    return Object.values(object);
  });
  sheet.getRange(2, 1, data.length, headers.length).setValues(data);
}