const LSkey = ["place","thing_name","thing_value","bagIndex","buttonIndex","buttonLevel"];
const LSdefault =
    [
        "混沌",
        JSON.stringify(["C(碳)","H(氢)","O(氧)","N(氮)","P(磷)","S(硫)"]),
        JSON.stringify([0,0,0,0,0,0]),
        0,0,JSON.stringify([])
    ];
var buttonsList = 
    [
        [[2,2,2,2,2,2],"造物万岁","一款神秘游戏的第一个按钮",[1,1,1,1,1,1]],
        [[5,5,5,5,5,5],"产线全开","每次点击增加2种(每种1个)随机元素",[10,10,10,10,10,10]],
        [[5,5,5,5,5,5],"飞速生产","每次点击增加2个(随机1种)随机元素",[10,10,10,10,10,10]]
    ];
var beginPrice =
    [
        [1,1,1,1,1,1],
        [10,10,10,10,10,10],
        [10,10,10,10,10,10]
    ]
for(let i=0; i<LSkey.length; i++){
    if(!localStorage.getItem(LSkey[i])){
        localStorage.setItem(LSkey[i],LSdefault[i]);
    }
}
var canbuy,lastSave;
var baggageList = [];
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var place = localStorage.getItem("place");
var click = document.getElementById('click');
var bagIndex = localStorage.getItem("bagIndex");
var baggages = document.getElementById("baggages");
var buttonIndex = localStorage.getItem("buttonIndex");
var instruction = document.getElementById("instruction");
document.getElementById("place").innerHTML = "造物之地 "+ place;
var thing_name = JSON.parse(localStorage.getItem("thing_name"));
var thing_value = JSON.parse(localStorage.getItem("thing_value"));
var buttonLevel = JSON.parse(localStorage.getItem("buttonLevel"));
for(let i=0; i<buttonLevel.length; i++){
    buttonLevel_setup(i);
}
for(let i=0,baggage=0; i<11; i++){
    baggage = document.createElement("p");
    baggage.id = "baggage" + i;
    baggages.appendChild(baggage);
    baggageList.push(baggage);
}
baggage_setup();
for(let i=0; i<buttonIndex; i++){
    newButton(i);
}
document.getElementById('bag').addEventListener('click', function() {
    bag();
});
document.getElementById('bag').addEventListener('mouseenter', function() {
    instruction.style.display = "block";
    instruction.textContent = "背包 当前拥有物品种类 : "+ thing_name.length;
});
document.getElementById('bag').addEventListener('mouseleave', function() {
    instruction.style.display = "none";
});
document.getElementById('save').addEventListener('mouseenter', function() {
    instruction.style.display = "block";
    instruction.textContent = "保存 上次保存时间:"+lastSave;
});
document.getElementById('save').addEventListener('mouseleave', function() {
    instruction.style.display = "none";
});
document.getElementById('save').addEventListener('click', function() {
    save();
});
document.getElementById('pageUp').addEventListener('click', function() {
    if(thing_name[(bagIndex+1)*10+1]){    
        bagIndex++;
        baggage_setup();
    }    
});
document.getElementById('pageUp').addEventListener('mouseenter', function() {
    instruction.style.display = "block";
    instruction.textContent = "背包翻页-上一页 当前页数 : "
     + (parseInt(bagIndex)+1) + "/" + Math.ceil(thing_name.length/10);
});
document.getElementById('pageUp').addEventListener('mouseleave', function() {
    instruction.style.display = "none";
});
document.getElementById('pageDown').addEventListener('click', function() {
    if(bagIndex>0){    
        bagIndex--;
        baggage_setup();
    }    
});
document.getElementById('pageDown').addEventListener('mouseenter', function() {
    instruction.style.display = "block";
    instruction.textContent = "背包翻页-下一页 当前页数 : "
     + (parseInt(bagIndex)+1) + "/" + Math.ceil(thing_name.length/10);
});
document.getElementById('pageDown').addEventListener('mouseleave', function() {
    instruction.style.display = "none";
});
document.addEventListener('keyup', function(event) {
    if(event.key === 'e') {
        bag();
    }
});
function bag(){
    if(baggages.style.display === "none") {
        baggages.style.display = "block";
    }else{
        baggages.style.display = "none";
    }
}
function baggage_setup(){
    for(let i=0; i<11; i++){
        if(!thing_name[i+(parseInt(bagIndex)*10)]){
            baggageList[i].textContent = "";
        }else{
            baggageList[i].textContent = 
            thing_name[i+(bagIndex*10)]+
            ":"+thing_value[i+(bagIndex*10)];
        }
        baggageList[i].style.color="white"
    }
}
function baggage_format_setup(id){
    canbuy=true;
    for(let i=0;i<buttonsList[id][3].length;i++){
        if(buttonsList[id][3][i]>thing_value[i]){
            canbuy=false;
            baggageList[i].style.color= "red";
        }else{
            baggageList[i].style.color= "green";
        }
        baggageList[i].innerHTML+= "/"+buttonsList[id][3][i];
    }
}
function buttonLevel_setup(id){
    for(let i=0; i<buttonsList[id][3].length; i++){
        buttonsList[id][3][i] = 
        Math.round(Math.pow(1.3,buttonLevel[id])
        *beginPrice[id][i]);
    }
}
function newButton(id){
    let button = document.createElement("button");
    button.id = "button"+id;
    button.className = "buttons";
    if(window.innerWidth >600){
        (id & 1) === 0 ? button.style.left = "23vw" : 
                        button.style.right = "23vw";
    }else{
        (id & 1) === 0 ? button.style.left = "3vw" : 
                        button.style.right = "43vw";
    }
    button.style.top = (((id & 1) === 0 ? 1 : 0)+ 
                        Math.ceil(id/2))*(window.innerWidth>500? 15:20) + 7 +"vh";
    button.textContent = buttonsList[id][1];
    buttons.appendChild(button);
    var buttonMonitor = document.getElementById("button"+id);
    buttonMonitor.addEventListener('mouseenter', function() {
        instruction.innerHTML = buttonsList[id][1] +' : '+ buttonsList[id][2];
        baggage_setup();
        baggage_format_setup(id);
        instruction.style.display = "block";
    });
    buttonMonitor.addEventListener('mouseleave', function(event) {
        baggage_setup();
        instruction.style.display = "none";
    });
    buttonMonitor.addEventListener('click', function(event) {
        if(canbuy){
            for(let i=0;i<buttonsList[id][3].length;i++){
                thing_value[i]-=buttonsList[id][3][i];
            }
            buttonLevel[id]++;
            buttonLevel_setup(id);
            baggage_setup();
            baggage_format_setup(id);
        }else{
            click.style.left = event.clientX + 'px';
            click.style.top = event.clientY + 'px';
            click.textContent = "你付不起"+'"'+buttonsList[id][1]+'"'+"!";
            click.style.color = "#25415C";
            click.style.textShadow = 
            "-1px -1px 0 #fff,"+
            "1px -1px 0 #fff,"+
            "-1px  1px 0 #fff,"+
            "1px  1px 0 #fff";
            click.style.display = "block";
            transparent(click, 40,0);
        }
    });
}
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}
window.addEventListener('resize', debounce(function(event) {
    if((windowWidth!=window.innerWidth) || (windowHeight!=window.innerHeight)){
        for(let i=0; i<buttonIndex; i++){
            document.getElementById("button"+i).remove();
            newButton(i);
        }
    }
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
}, 250));
function save(){
    for(let i=0; i<=LSkey.length; i++){
        if(typeof(eval(LSkey[i])) !="string"){
            localStorage.setItem(LSkey[i],JSON.stringify(eval(LSkey[i])));
        }else{
            localStorage.setItem(LSkey[i],eval(LSkey[i]));
        }
    }
    let date = new Date(); 
    lastSave = (date.getHours()<10? "0":"")+
    date.getHours()+":"+
    (date.getMinutes()<10? "0":"")+
    date.getMinutes();
}
setInterval(save(), 40000);
function transparent(element, interval, end) {
    element.style.opacity = 1;
    let start = 1;
    let execute = setInterval(() => {
        start -= 0.1;
        element.style.opacity = start;
        if (start <= end) {
            clearInterval(execute);
            element.style.display = "none";
            click.style.color = "white";
            click.style.textShadow = null;
        }
    }, interval);
}
const audio = document.getElementById("audio");
document.addEventListener('click', function() {
    if(audio.paused){
        audio.play();
    }
});
document.addEventListener('click', function(event) {
    if(event.clientX<window.innerWidth-50 && 
        event.clientY<window.innerHeight-50 &&
        event.target.tagName == "HTML" ){

        let randomElement = Math.floor(Math.random()*6);
        thing_value[randomElement] += 1;
        baggage_setup();
        if(click.style.display == "none" || click.style.display == ""){
            click.style.left = event.clientX + 'px';
            click.style.top = event.clientY + 'px';
            click.textContent = "获得1个"+thing_name[randomElement]+"元素";
            click.style.display = "block";
            transparent(click, 40,0);
        }
        if(buttonsList[buttonIndex]){
            let a=true;
            for(let i=0;i<buttonsList[buttonIndex][0].length;i++){
                if(buttonsList[buttonIndex][0][i]>thing_value[i]){
                    a=false;
                    break;
                }
            }
            if(a){
                newButton(buttonIndex++);
                buttonLevel.push(0);
            }
        }
    }
});