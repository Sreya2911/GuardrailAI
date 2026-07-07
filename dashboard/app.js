const timeline=document.getElementById("timeline");
const totalRequests=document.getElementById("totalRequests");
const approvedRequests=document.getElementById("approvedRequests");
const blockedRequests=document.getElementById("blockedRequests");
const averageRisk=document.getElementById("averageRisk");
const eventTable=document.getElementById("eventTable");
const aiReasoning=document.getElementById("aiReasoning");


let riskChart;
let trendChart;

async function loadDashboard(){

const res=await fetch("/api/logs?"+Date.now());
const logs=await res.json();

updateCards(logs);
updateTimeline(logs);
updateTable(logs);
updateReasoning(logs);
updateCharts(logs);

}

function updateCards(logs){

totalRequests.textContent=logs.length;

const approved=logs.filter(x=>x.decision==="APPROVED").length;
const blocked=logs.filter(x=>x.decision==="BLOCKED").length;

approvedRequests.textContent=approved;
blockedRequests.textContent=blocked;

const avg=logs.length
?Math.round(logs.reduce((a,b)=>a+b.riskScore,0)/logs.length)
:0;

averageRisk.textContent=avg+"%";

}

function updateTimeline(logs){

timeline.innerHTML="";

logs.forEach(log=>{

const div=document.createElement("div");

div.className="timeline-card fade";

div.style.borderLeftColor=
log.decision==="APPROVED"
?"#22c55e"
:"#ef4444";

div.innerHTML=`

<div class="timeline-header">

<div>

<div class="timeline-title">

${log.filePath}

</div>

<div class="timeline-time">

${new Date(log.timestamp).toLocaleString()}

</div>

<div class="${
log.decision==="APPROVED"
?"status-approved"
:"status-blocked"
}">

${log.decision}

</div>

<div class="reason">

${log.reason}

</div>

${
log.violations.length
?`

<div class="violation">

${log.violations.join(", ")}

</div>

`
:""
}

</div>

<div class="risk-box">

<div class="risk-score">

${log.riskScore}

</div>

<div class="risk-text">

Risk

</div>

</div>

</div>

`;

timeline.appendChild(div);

});

}

function updateTable(logs){

eventTable.innerHTML="";

logs.slice(0,10).forEach(log=>{

eventTable.innerHTML+=`

<tr>

<td>${log.decision}</td>

<td>${log.filePath}</td>

<td>${log.riskScore}</td>

<td>${log.reason}</td>

</tr>

`;

});

}

function updateReasoning(logs){

if(!logs.length){

aiReasoning.innerHTML="Waiting for audits...";

return;

}

aiReasoning.innerHTML=`

<b>Latest Decision</b>

<br><br>

${logs[0].reason}

`;

}

function updateCharts(logs){

const approved=logs.filter(x=>x.decision==="APPROVED").length;
const blocked=logs.filter(x=>x.decision==="BLOCKED").length;

if(riskChart)
riskChart.destroy();

riskChart=new Chart(

document.getElementById("riskChart"),

{

type:"doughnut",

data:{

labels:["Approved","Blocked"],

datasets:[{
    data:[approved,blocked],

    backgroundColor:[
        "#22c55e",   // Green
        "#ef4444"    // Red
    ],

    hoverBackgroundColor:[
        "#16a34a",
        "#dc2626"
    ],

    borderWidth:0,

    hoverOffset:8
}]

},

options:{

responsive:true,
maintainAspectRatio:false,
cutout:"68%",

plugins:{

    legend:{
        position:"bottom",
        
        labels:{
        color:"#cbd5e1",
        padding:22,
        usePointStyle:true,
        pointStyle:"circle",
        boxWidth:10,
        font:{
        size:14,
        weight:"600"
        }
        }
        }

}


}

}

);

if(!trendChart){

trendChart=new Chart(

document.getElementById("trendChart"),

{

type:"line",

data:{

labels:logs.map((_,i)=>i+1),

datasets:[{
    label:"Risk Score",
    data:logs.map(x=>x.riskScore),
    
    borderColor:"#38bdf8",
    backgroundColor:"rgba(56,189,248,0.12)",
    
    borderWidth:3,
    
    fill:true,
    
    tension:.45,
    
    clip:false,
    
    pointRadius:4,
    
    pointHoverRadius:7,
    
    pointBackgroundColor:"#38bdf8",
    
    pointBorderColor:"#ffffff",
    
    pointBorderWidth:2,
    
    pointHoverBorderWidth:3
    }]

},

options:{



responsive:true,
maintainAspectRatio:false,


animation:{
duration:1500,
animateRotate:true,
animateScale:true,
easing:"easeOutQuart"
},

plugins:{
    legend:{
        position:"bottom",
        
        labels:{
        color:"#cbd5e1",
        padding:20,
        usePointStyle:true,
        pointStyle:"circle",
        
        font:{
        size:13,
        weight:"600"
        }
        }
        }
},

layout:{
    padding:15
    },

scales:{

    x:{
    grid:{
    display:false
    },
    ticks:{
    color:"#cbd5e1",
    font:{
    size:12,
    weight:"500"
    }
    }
    },
    
    y:{
    beginAtZero:true,
    max:100,
    
    grid:{
    color:"rgba(255,255,255,0.08)",
    drawBorder:false
    },
    
    ticks:{
    stepSize:20,
    color:"#cbd5e1",
    font:{
    size:12
    }
    }
    }
    
    }

}

}

);

}else{

trendChart.data.labels=logs.map((_,i)=>i+1);
trendChart.data.datasets[0].data=logs.map(x=>x.riskScore);
trendChart.update();

}

}

function downloadLog(){

fetch("/api/logs")

.then(r=>r.json())

.then(data=>{

const blob=new Blob(
[
JSON.stringify(data,null,2)
],
{
type:"application/json"
}
);

const url=URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;

a.download="Compliance_Report.json";

a.click();

});

}

const sectionMap={
    "Dashboard":"dashboard",
    "Audit Logs":"auditlogs",
    "Violations":"violations",
    "Policy Engine":"policy",
    "Gemini Auditor":"auditor",
    "Reports":"reports"
    };
    
    document.querySelectorAll(".menu-item").forEach(item=>{
    
    item.onclick=()=>{
    
    document.querySelectorAll(".menu-item")
    .forEach(i=>i.classList.remove("active"));
    
    item.classList.add("active");
    
    const target=document.getElementById(sectionMap[item.innerText.trim()]);
    
    if(target){
    
    target.scrollIntoView({
    behavior:"smooth",
    block:"start"
    });
    
    }
    
    };
    
    });

loadDashboard();

setInterval(loadDashboard,5000);