function letsScrape(){
Logger.log( "Getting globals" );
const globals = createGlobals();
Logger.log( "Scraping started" );
let results = [];

globals[0].cleanData.forEach(function(data,index){ // Main Loop
let checkTime = mkHelpers.whatTimeIsNow(); 
let link = data.link; // URL to check
let searchKey = data.check; // selector to find
let fullPage = getContent_(link); // the full HTML page

let content = Cheerio.load(fullPage); // Loaded in Cheerio

let rawTitle = content( searchKey ).text();
let cleanTitle = rawTitle.trim();

if(compareValues_( data.title, cleanTitle )){
Logger.log("Nothing is changed since last check");
results.push({'oldvalue':data.title,
                'newvalue':cleanTitle,
                'changed':false,
                'lastcheck': checkTime});
mkHelpers.setSingleValue( globals[0].singleSheetObj, index, 5, checkTime); // check time
mkHelpers.setSingleValue( globals[0].singleSheetObj, index, 6, "Not Updated"); // check status
} else {
Logger.log("Value changed, update sheet - old value: " + data.title + " - new value: " + cleanTitle);
results.push({'oldvalue':data.title,
                'newvalue':cleanTitle,
                'changed':true,
                'lastcheck': checkTime});
mkHelpers.setSingleValue( globals[0].singleSheetObj, index, 4, cleanTitle); // new title
mkHelpers.setSingleValue( globals[0].singleSheetObj, index, 5, checkTime); // check time
mkHelpers.setSingleValue( globals[0].singleSheetObj, index, 6, "Updated"); // check status
}

//let searchDownKey = data.download;
//let downLink = content( searchDownKey ).attr("href"); 
//setSingleValue( singleSheetObj, index, 5, downLink)
//Logger.log( cleanText );
})
}