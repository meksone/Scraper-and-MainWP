function getContent_(url) {
  try {
    /*
    var options = {
  'muteHttpExceptions' : true,
  'headers' 
  }
  */
let response = [];
response.push(true);
response.push(UrlFetchApp.fetch(url).getContentText());

return response;

  } catch (e) {
    Logger.log(e.message);
    let response = [];
    response.push(false);
    response.push(e.message);

return response;
  }
}



function removeLeadTrailSpaces_(string) {
for ( i=0 ; i < string.length; i++) {
string[i].replaceText("^\\s+", "");
string[i].replaceText("\\s+$", "");
return string;
}
}

/**
 * All Generic Helpers
 * 
 * loDash Lib
 * https://github.com/contributorpw/lodashgs
 * 
 * Underscore Lib
 * https://github.com/simula-innovation/gas-underscore
 * 
 * 
 */



/**
 * converte l'array 2D in una array di oggetti
 * https://stackoverflow.com/a/22917499/1027723
 * for pretty version see https://hawksey.info/blog/?p=17869/#comment-184945
 * 
 */
function convertArray(data, header) {
  var obj = data.map(function (values) {
    return header.reduce(function (o, k, i) {
      o[k] = values[i];
      return o;
    }, {});
  });
  return obj;
} //fine convertArray

/**
 * Friendly Date 0.2
 * Transform extended date in friendly human readable date
 * 
 * @param {string} datestring date in string format;
 * @param {string} format (optional) provide a JS string to format the date - default is "dd/MM/yyyy HH:mm:ss Z";
 * @return {string} human readable date in string format;
 * */

function friendlyDate(datestring, format) {
  if (format === undefined) {
    let format = "dd/MM/yyyy HH:mm:ss Z";
  }
  let timezone = "Europe/Rome";
  const friendly = Utilities.formatDate(new Date(datestring), timezone, format);
  return friendly;
}

/**
 * Return correctly formatted Data object at the time is invoked 
 * "Data" is intended as date + time ;) 
 * @param format {string} - (optional) Default "dd/MM/yyyy HH.mm.ss"
 * @param timezone {string} - (optional) Default "Europe/Rome"
 */
function whatTimeIsNow(format, timezone){
    if (format === undefined) {
    var format = "dd/MM/yyyy HH.mm.ss";
  }
  if (timezone === undefined) {
    var timezone = "Europe/Rome";
  } 
let currentData = Utilities.formatDate(new Date(), timezone, format);
return currentData;
}

/**
 * Return correctly formatted Data object of given data string
 * @param datestring {string} - string of a date (check with isDate is reccommended)
 * @param format {string} - (optional) Default "dd/MM/yyyy HH.mm.ss"
 * @param timezone {string} - (optional) Default "Europe/Rome"
 */
function whatTimeIsIt(datestring,format,timezone){
    if (format === undefined) {
    var format = "dd/MM/yyyy HH.mm.ss";
  }
  if (timezone === undefined) {
    var timezone = "Europe/Rome";
  } 
let currentData = Utilities.formatDate(new Date(), timezone, format);
return currentData;
}


/*  Funzione che verifica se una data STRINGA può essere valida come data;
*   converte la stringa in un oggetto Data e verifica se è valido o meno; 
*   il valore di ritorno è un booleano true/false
*/
function isDate(date) {
  var checkdate = new Date(date);
  var result = date instanceof Date && !isNaN(date.valueOf())
  return result;
};



/*  Taglia un'array in due parti, e prende N elementi dalla parte "a destra"
*   In pratica serve per elaborare gli ultimi N valori di una array più grande
*/

function tagliaArray(array, howManyElements) {
  var arrayTagliata = array.slice(Math.max(array.length - howManyElements, 1))
  return arrayTagliata;
}


/**
 * Funzione per leggere dati da qualsiasi sheet
 * Come output si ottiene una array con tutti i dati
 * 
 * Ad ogni index troveremo i dati dei valori delle colonne.
 * 
 * Le prime due righe (0 e 1) sono le due righe di intestazione e si possono ignorare;
 * i valori che ci servono sono i seguenti:
 * [INDEX][0] = ID dell'SDC
 * [INDEX][1,3,5,7,9,11] = pianificazione, imballi, produzione, qualità, controllo gestione, amministrazione
 * Index DEFINITIVI da usare: 1,3,5,11 + 0 per idSDC
 * [INDEX][35] = è il campo Data della deadline di compilazione 
 * 
 * @param {object} ssObj - l'oggetto spreadsheet, da ottenere tramite SpreadsheetApp.openByID(ID)
 * @param {string} sheetName - il nome dello sheet all'interno dello SpreadSheet
 * @returns {(Array)} - Array che contiene tutti i dati dello sheet indicato
 */
function readRange(ssObj, sheetName) {

  // l'oggetto gSheet lo passo nei parametri della funzione, per flessibilità, come del resto anche il nome dello sheet; 
  var sheet = ssObj.getSheetByName(sheetName);

  Logger.log("Ho caricato il gSheet " + sheetName + " contenuto nel foglio " + ssObj.getName())
  var range = sheet.getDataRange();
  var data = range.getValues();
  return data;
} //Fine readRange



/**
 * Create the complete associative array
 * 
 * @param googleSheet the whole Google sheet
 * @param completeData data taken with readrangeA1notation
 * 
 */
function getCleanData(googleSheet, completeData) {
  var dataLastRow = googleSheet.getLastRow();
  //var dataSpliced = completeData.splice(dataLastRow, completeData.length - 1); // non serve?
  // sposta l'intestazione e lascia solo l'array dei valori
  var header = completeData.shift();

  // diventano tutte coppie key|value
  var associativeArray = convertArray(completeData, header);
  return associativeArray;
}

/**
* Get value at given row, taken by exact column name
* 
* @data {object} data the result of sheet.getDataRange().getValues();
* @param {string} colName name of the column, mAtCh ThE cAsE!
* @param {number} row number of the row, probably passed by the loop iteration
*/
function getByName(data, colName, row) {
  //var sheet = SpreadsheetApp.getActiveSheet();
  //var data = sheet.getDataRange().getValues();
  var col = data[0].indexOf(colName);
  if (col != -1) {
    return data[row][col];
  }
}

/**
 * Checks if a JavaScript value is empty
 * @example
 *    isEmpty(null); // true
 *    isEmpty(undefined); // true
 *    isEmpty(''); // true
 *    isEmpty([]); // true
 *    isEmpty({}); // true
 * @param {any} value - item to test
 * @returns {boolean} true if empty, otherwise false
 */
function isEmpty(value) {
  return (
    value === null || // check for null
    value === undefined || // check for undefined
    value === '' || // check for empty string
    (Array.isArray(value) && value.length === 0) || // check for empty array
    (typeof value === 'object' && Object.keys(value).length === 0) // check for empty object
  );
}

/*  2020-02-01
*   Converte qualsiasi stringa che contiene spazi
*   e la codifica per essere usata come URL;
*   insomma converte gli spazi in %20 ;)
*/
function encodeURL(string) {
  var result = encodeURIComponent(string);
  Logger.log("Stringa convertita per l'uso in URL: " + result);
  return result;
};


/**
 * Function to write a single value in cell;
 * Remember to check if you data has Header row or not!
 * 
 * If our data is clean, without header, the offset is 2, and this is the default value;
 * If your data has header at position 0, you must set 1;
 * 
 * @param {object} sheet object, taken with getSheetByName(*);
 * @param {string} rowindex index of the row; always skip postion 0 in dataset (header row);
 * @param {string} column number of the column;
 * @param {string} value the value that must be written in the cell;
 * @param {string} offset (optional) value for offset (default:2 for data without header's row, 1 for data with header row);
 *
 */
function setSingleValue(sheet, rowindex, column, value, offset) {
  if (offset === undefined) {
    var offset = 2;
  } 

    sheet.getRange(rowindex + offset, column).setValue(value);
    Logger.log('Value: ' + value + ' set at row\'s index: ' + rowindex + ' offset: ' + offset + ' of column number: ' + column);
  
} // END setSingleValue




/**
 * is a valid Email?
 * @param {string} email the string that it's supposed to be an email address
 * 
 * Returns true is is valid email, otherwise false
 *   
 */

function isEmail(email) {
  var test = email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  if (test !== null) {
    return true;
  } else {
    return false;
  }
} // END isEmail



/**
 * Create HTML email body from simple template
 * 
 * Remember to set the same amount of tokens as in template, otherwise error occurs
 * For example, if in template there are 2 tokens, you must provide 2 tokens as parameters
 *  
 * @param {string} templateName exact name of the html template (no .html extension)
 * @param {string} token1 string with text to be substituted in html body
 * @param {string} token2 (optional) ...
 * @param {string} token3 (optional) ...
 * @param {string} token4 (optional) ...
 * @param {string} token5 (optional) ...
 * 
 */
function createEmailBodyFromTemplate1(templateName, token1, token2, token3, token4, token5) {
  var bodyHtml = HtmlService.createTemplateFromFile(templateName);

  // Valori per i placeholders contenuti nell'HTML della mail
  bodyHtml.tmplToken1 = token1;
  if(token2){
    bodyHtml.tmplToken2 = token2;
  }
  if(token3){
    bodyHtml.tmplToken3 = token3;
  }
  if(token4){
    bodyHtml.tmplToken4 = token4;
  }
  if(token5){
    bodyHtml.tmplToken5 = token5;
  }
  

  // evaluate and get the html
  var email_html = bodyHtml.evaluate().getContent();

  return email_html;

}

/**
 * Append data on last row
 * 
 * 
 */
function appendRow(ssID, sheetName, value) {
  var spreadsheet = ssID;
  var sheet = spreadsheet.getSheetByName(sheetName);

  sheet.getRange(sheet.getLastRow() + 1).setValues([value]);
}


function formatDate(yesterday) {
  var yesterday = new Date();
  yesterday;
  yesterday.setDate(yesterday.getDate() - 1);
  return [
    yesterday.getDate(),
    yesterday.getMonth() + 1,
    yesterday.getFullYear(),
  ].join('/')
  + (' 00:00:00');
}

function compareNumbers(num1, num2) {
  if(num1 > num2)
    return 1;
  if(num1 < num2)
    return -1;
  return 0;
}

function sortNumbers() {
  var numbers = [1,5,2,10,7,20,3];
  Logger.log(numbers);
  Logger.log(numbers.sort(compareNumbers));
}

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}

/**
 * Function to split a list of links (comma separated)
 * in array, and build a link list in HTML
 * for inserting in email template using a SINGLE token
 * 
 * @param string {string} comma separated links
 */

function createHtmlLinkList(string) {
  let splitted = string.split(','); // links array created
  let linklist = [];
  splitted.forEach(function(link,index) {
    var index2 = index +1

    let buildedLink = `<li><a href="${link}">Documento aggiuntivo n.${index2}</a></li>`;
        linklist.push(buildedLink);
  })
  var htmllist = linklist.join("");
  var exitvalue = HtmlService.createHtmlOutput(htmllist).getContent();
  return exitvalue;
}

function appendRow2(ssID, sheetName, value) {
  var spreadsheet = ssID;
  var sheet = spreadsheet.getSheetByName(sheetName);

  //sheet.getRange(sheet.getLastRow() + 1).setValues([value]);
  sheet.appendRow(value);
}
