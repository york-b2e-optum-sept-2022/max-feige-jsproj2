const canvas = document.getElementById("clock-render");
const ctx = canvas.getContext('2d');

let lastMillis = 1661521684746;
//String display names
const days = 
[
    'Sunday',
    'Monday',
    'Tueday',
    'Wednesday',
    'Thusday',
    'Friday',
    'Saturday'
]
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
function UpdateClockDisplay()
{
    //Pretend its 1000x1000 for rendering
    canvas.width = 1000;
    canvas.height = 1000;

    const cvWidth = canvas.width;
    const cvHeight = canvas.height;
    //Center of canvas
    const centerX = cvWidth/2;
    const centerY = cvHeight/2;

    //Radius of clock calculated to always be circular within the canvas
    const r = 0.9 * Math.min(cvWidth,cvHeight)/2;


    //Draw a white center of the clock
    ctx.fillStyle = "white";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX,centerY,r,0,2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    //Draw the outline of the clock
    ctx.style = "black";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX,centerY,r,0,2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    const angleOffset = Math.PI/2;

    //Draw the little lines on the clock
    for(let i = 0; i < 360;i++)
    {
        let angle = (Math.PI * 2 / 60) * i;
        let adj = 0.97;
        //Draw slightly bigger lines at each labeled mark
        if(i% 5 === 0)
        {
            adj = 0.95;
        }
        let s_tx = Math.cos(angle - angleOffset)  *r + centerX;
        let s_ty = Math.sin(angle - angleOffset) * r + centerY;
        let e_tx = Math.cos(angle - angleOffset)  *r * adj + centerX;
        let e_ty = Math.sin(angle - angleOffset) * r * adj + centerY; 
        
        ctx.beginPath();
        ctx.moveTo(s_tx,s_ty);
        ctx.lineTo(e_tx,e_ty);
        ctx.stroke();
    }

    //Draw each of the numbers on the clock
    ctx.fillStyle = "black";
    for(let i = 12; i > 0;i--)
    {
        let angle = (Math.PI * 2 / 12) * i;
        let tx = Math.cos(angle - angleOffset) * 0.9 *r + centerX - 15;
        let ty = Math.sin(angle - angleOffset) * 0.9 *r + centerY + 15;
        ctx.font = '48px serif';
        ctx.fillText(i.toString(),tx,ty);
    }
    //Using millis sinc eepcoih to get a date time in local itmezone
    let date = new Date(lastMillis);
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let millis = 0;

    //Helper function to draw each hand
    function drawHand(angle,size,length,color)
    {
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(centerX,centerY);
        let tx = length * Math.cos(angle - angleOffset) * 0.9 *r + centerX ;
        let ty = length * Math.sin(angle - angleOffset) * 0.9 *r + centerY;
        ctx.lineTo(tx,ty);
        ctx.stroke();
    }

    //Calculate values as decimals
    let milliVal = millis; // [0,1000]
    let secondVal = seconds+milliVal/1000; //[0,60]
    let minuteVal = minutes+secondVal/60; //[0,60]
    let hourVal =  hour + minuteVal/60; // [0,24]
    
    //Draw each hand appropriately with differing colors, heights, and widths
    drawHand( (hourVal % 12) * Math.PI / 6,6,0.5, "black");
    drawHand( (minuteVal % 60) * Math.PI / 30,6,0.9, "black");
    drawHand( (secondVal) % 60 * Math.PI/30,4,1,"red");
    
    //Draw center of clock
    ctx.fillStyle = "black";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX,centerY,15,0,2 * Math.PI);
    ctx.closePath();
    ctx.fill();


    //heoper function to display text as XX:YY:ZZ
    function padNum(num)
    {
        return String(num).padStart(2,'0');
    }
    //Display the clock value in html
    let h = parseInt(hourVal % 12);
    if(h === 0)
    {
        h = 12;
    }
    
    document.getElementById("time-text").innerHTML= days[date.getDay()] +", " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + " " + padNum(h)+":"+padNum(parseInt(minuteVal))+":"+padNum(parseInt(secondVal)) +" " + (hourVal > 12 ? "pm" : "am");
}
//Update every milli second
setInterval(UpdateClockDisplay,1);

//Update with milis since epoch from jsontest api
async function loop()
{

    //infinte updating loop!
    while(true)
    {
        let dt = await fetch("http://time.jsontest.com/");
        dt = await dt.json();
        lastMillis = dt.milliseconds_since_epoch;
    }
}

loop();
