
//Colors to show that json is valid is invalid
const validJsonColor = "#90EE90"
const invalidJsonColor = "#F08080"
//Fetches and updates json html appropriately
async function UpdateJsonArea(currentJsonText)
{
    let response = await fetch("http://validate.jsontest.com/?json="+encodeURIComponent(currentJsonText));

    if(response.ok && response.status === 200)
    {
        let rjson = await response.json();
        let isValid = rjson.validate;
        if(isValid)
        {
            document.getElementById("json-valid").style.backgroundColor = validJsonColor;
            document.getElementById("json-verify").innerHTML = "Json Is Valid";
        }
        else
        {
            document.getElementById("json-valid").style.backgroundColor = invalidJsonColor;
            document.getElementById("json-verify").innerHTML = rjson.error;

        }
    }
    else
    {
        document.getElementById("json-valid").style.backgroundColor = invalidJsonColor;
        document.getElementById("json-verify").innerHTML = "Failed to get response from <a href = 'http://validate.jsontest.com/'>http://validate.jsontest.com/</a> ";
    }
}
//Json update settings to update when no new keystrokes are detected
let lastKeyJSON = Date.now()-1000;
let lastJSON = "";
let JSONUpdateInterval = 400;
function SetLastJSONStroke()
{
    if(lastJSON !== document.getElementById("json-text").value)
    {
        lastJSON = Date.now();
        document.getElementById("json-verify").innerHTML = "Updating validity...";
        document.getElementById("json-valid").style.backgroundColor = invalidJsonColor;
    }
    
}
//Checks if the text area string has changed and then calls itself periodically
function checkForJSONUpdate()
{
    //Only update when the text has actually changed

    let cjson = document.getElementById("json-text").value;
    
    if(lastJSON !== cjson && Date.now()-lastKeyJSON > JSONUpdateInterval)
    {
        UpdateJsonArea(cjson);
        lastJSON = cjson;
    }
    setTimeout(checkForJSONUpdate,50);
}
//MD5 update settings to update when no new keystrokes are detected
let lastKeyMD5 = Date.now()-1000;
let lastMD5 = "";
let md5UpdateInterval = 400;
function SetLastMD5Stroke()
{
    //Only update when the text has actually changed
    if(lastMD5 !== document.getElementById("md5-text").value)
    {
        lastKeyMD5 = Date.now();
        document.getElementById("md5-hash").innerHTML="Updating md5...";
    }
    

}
//Fetches and updates md5 html appropriately
async function UpdateMD5Area(md5String)
{
    lastKeyMD5 = Date.now();
    let response = await fetch("http://md5.jsontest.com/?text="+encodeURIComponent(md5String));
    retStr = "";
    if(response.ok && response.status === 200)
    {
        let json = await response.json();
        retStr = json.md5;
    }
    else
    {
        retStr = "Failed to get response from <a href = 'http://md5.jsontest.com/'>http://md5.jsontest.com/</a> "
    }
    document.getElementById("md5-hash").innerHTML=retStr;
    
}
//Checks if the text area string has changed and then calls itself periodically

function checkForMD5Update()
{
    let md5String = document.getElementById("md5-text").value;
    
    if(md5String !== lastMD5 && Date.now()-lastKeyMD5 > md5UpdateInterval)
    {
        UpdateMD5Area(md5String);
        lastMD5 = md5String;
    }
    setTimeout(checkForMD5Update,50);
}
//Do an update initially
checkForJSONUpdate();
checkForMD5Update();