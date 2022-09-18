//Init a few variables
let headersString = "Failed to get headers";
let element = document.getElementById("http-info");

//This function makes the list collapsible by toggling the max height
function onCollapsibleClick(element)
{
    element.classList.toggle("active");
    var content = element.nextElementSibling;
    if (content.offsetHeight !== 0)
    {
        content.style.maxHeight = "0vh";

    } else 
    {

        content.style.maxHeight = "7vh";
    } 
}

let headerResp;
//Attempts to fetch headers from jsontest
async function FetchHeaders()
{


    //Fetch teh headers test
    headersReq = await fetch("http://headers.jsontest.com/");
    //Set up html on success
    if(headersReq.ok && headersReq.status === 200)
    {
        //set up section for each header
        let headersJson = await headersReq.json();
        headersResp = headersJson;
        headersString = "<div id = 'http-label'><b>Recieved HTTP Headers:</b> <br/></div>";
        for(const key  in headersJson)
        {
            headersString += '<button type = "button" class = "collapsible">' + key+":</button>";
            headersString += '<div class = "collapsibleContent"><b>' + headersJson[key] + "</b></div>"
        }
        element.innerHTML = headersString;
        
        //Set up our new divs and buttons to call the onCollapsibleClick function
        var colls = document.getElementsByClassName("collapsible");
        var i;
        //Hooks in the javascript to new elements
        for (i = 0; i < colls.length; i++) 
        {
            colls[i].addEventListener("click", function()
            {
               onCollapsibleClick(this);
            });
        }

    }
    else
    {
        //Display failed to retrieve in html
        element.innerHTML = "Failed to retrieved headres test from <a href = 'http://headers.jsontest.com/'>http://headers.jsontest.com/</a>"
    }
}


FetchHeaders();

