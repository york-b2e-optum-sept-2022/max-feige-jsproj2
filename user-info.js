//This is a pretend enum with all of our options
const NOTHING = 0;
const IP = 1;
const LOC = 2;
const COOKIES = 3;
const CORES = 4;
const RESOLUTION = 5;
const SIZE = 6;

//These variables will be locally stored strings that can be easily displayed
let ipAddress;
let loc = "Allow or Block Location Prompt";
let cookieEnabled;
let numCores;
let screenSize;
let browserSize;

//This function gets the async data (ip address and geo location), checks for validity
//And updates the proper variables to display either the result or the error.
async function GetData()
{
    ipAddressFetch = fetch("http://ip.jsontest.com/");
    //Geolocation takes two variables: A function to run on success, and a function to run on failure
    geoGet = navigator.geolocation.getCurrentPosition( (x) => 
    {
        //On success set the location to a nice looking string with the coordinates
        loc = "(" + x.coords.latitude + ", " + x.coords.longitude+")";
    }, (y) => 
    {
        //On failure go over the possible options and set the string to tell user what went wrong
        switch(y.code)
        {
            case 1:
                loc = "Permissions was denied, cannot see location";
                break;
            case 2:
                loc = "Could not see location due to internal error";
                break;
            case 3:
                loc = "Could not see location due to timeout";
        }
    });

    //Get our ip address information

    ipAddressFetch = await ipAddressFetch;
    //Check that its okay and we got the proper data back.
    //If its okay we display the IP, otherwise we say we failed to get it.
    if(ipAddressFetch.ok == true && ipAddressFetch.status == 200)
    {
        let json = await ipAddressFetch.json();
        ipAddress=json.ip;
    }
    else
    {
        ipAddress = "Failed to fetch IP Address";
    }

}

//This is info we can easily get from the navigator/window that is updated each time we display something new
function UpdateInfo()
{
    cookieEnabled = navigator.cookieEnabled ? "Yes" : "No";
    numCores = navigator.hardwareConcurrency.toString();
    screenSize = window.screen.availWidth + " x " + window.screen.availHeight +" @ " + window.screen.colorDepth + " bit color";
    browserSize = window.innerWidth + " x " + window.innerHeight;
}

//Updates the proper html to display whatever we moused over last
function DisplayInfo(val)
{
    UpdateInfo();
    let resultDiv = document.getElementById("user-info-results");
    let  retText = "N/A";
    //Switch statement, crude but easy
    switch(val)
    {
        case NOTHING:
            retText = "<b>Hover Over An Item For Info</b>";
            break;
        case IP:
            retText = "<b>IP Info: <br/></b>" + ipAddress;
            break;
        case LOC:
            retText = "<b>Location Info: </b><br/>" + loc;
            break;
        case COOKIES:
            retText = "<b>Cookies Enabled: </b><br/>"  + cookieEnabled;
            break;
        case CORES:
            retText = "<b>Number of Logical Cores: </b><br/>" + numCores;
            break;
        case RESOLUTION: 
            retText = "<b>Resolution: </b><br/>" + screenSize;
            break;
        case SIZE:
            retText = "<b>Browser Size: </b><br/>" + browserSize;
            break;
        default:
            retText = "<b>Major Error</b>";
            break;
    }
    resultDiv.innerHTML = retText;
}

//Initialize display html
DisplayInfo(0);
GetData();