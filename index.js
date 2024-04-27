if(new URL(window.location.href).searchParams.get('lang')){
	lessonsListSet();
}
else{
  langsListSet();
}
var langsList=[];
var lessonsList=[];
var wordsList=[[],[],[]];
var limit=[];
var toSolve=[[],[],[]];
var remain=0;
function langsListSet(){
  fetch('https://sheets.googleapis.com/v4/spreadsheets/14kwQv_6Krk9wAlf1-d6exL7X-9nRsRZqppNCTuCw_rM/values/langs!A:D?key=AIzaSyATLeHQh6kM0LWRJjLg8CmzoSdnntFrmFk')
  .then(response=>response.json())
  .then(data=>{
    langsList=data.values;
    const langsListBox = document.getElementById('langs_list');
    let i='';
    langsList.forEach(row => {
      i+=`<div class="shadow-boxing" data-lang="${row[0]}">
        <sup>${row[0]}</sup><h2 style="display:inline-block;">${row[1]}</h2>
        <p>${row[2]}</p>
      </div>`;
    });
    langsListBox.innerHTML=i;
    document.querySelectorAll('.shadow-boxing').forEach(element=>{
      element.addEventListener('click',function(){
        const lang=this.getAttribute('data-lang');
        langsListBox.innerHTML='';
        history.pushState(null,'',`?lang=${lang}`);
        lessonsListSet();
      });
    });
  });
}
function lessonsListSet(){
  fetch('https://sheets.googleapis.com/v4/spreadsheets/14kwQv_6Krk9wAlf1-d6exL7X-9nRsRZqppNCTuCw_rM/values/langs!A:D?key=AIzaSyATLeHQh6kM0LWRJjLg8CmzoSdnntFrmFk')
  .then(response=>response.json())
  .then(data1=>{
    let lang=data1.values[data1.values.findIndex(row=>row[0]===new URL(window.location.href).searchParams.get('lang'))][3];
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${lang}/values/lessons!A:F?key=AIzaSyATLeHQh6kM0LWRJjLg8CmzoSdnntFrmFk`)
    .then(response=>response.json())
    .then(data2=>{
      lessonsList=data2.values;
      var lessonsListBox=document.getElementById('lessons_list');
      lessonsList.forEach(row=>{
        lessonsListBox.innerHTML+=`<div class="shadow-boxing" data-lesson=${row[0]}>
          <h2 style="display:inline-block;">${row[0]}</h2>
        </div>`;
      });
      document.querySelectorAll('.shadow-boxing').forEach(element=>{
        element.addEventListener('click',function(){
          const lesson=lessonsList[lessonsList.findIndex(row=>row[0]===this.getAttribute('data-lesson'))];
          lessonsListBox.innerHTML='';
          //history.pushState(null,'',`?lang=${lang}`);
          lessonStart(lesson);
        });
      });
    });
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${lang}/values/words!A:B?key=AIzaSyATLeHQh6kM0LWRJjLg8CmzoSdnntFrmFk`)
    .then(response=>response.json())
    .then(data3=>{
      wordsList[0]=data3.values;
    });
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${lang}/values/words!C:E?key=AIzaSyATLeHQh6kM0LWRJjLg8CmzoSdnntFrmFk`)
    .then(response=>response.json())
    .then(data4=>{
      wordsList[1]=data4.values;
    });
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${lang}/values/words!F:G?key=AIzaSyATLeHQh6kM0LWRJjLg8CmzoSdnntFrmFk`)
    .then(response=>response.json())
    .then(data5=>{
      wordsList[2]=data5.values;
    });
  });
}
function lessonStart(lesson){
	var passage=document.getElementById('passage');
  var toMemo=[];
  var num=1;
  remain=Number(lesson[4]);
  while(num<=3){
  if(lesson[num]!=='0'){
    var i=Number(lesson[num].split('-')[0])-1;
    if(lesson[num].split('-')[1]){
      var j=Number(lesson[num].split('-')[1])-1;
    }
    else{
      var j=i;
    }
    limit.push(j);
    while(i<=j){
      toSolve[num-1].push(wordsList[num-1][i]);
      if(num===1){
        toMemo.push(wordsList[num-1][i]);
      }
      i++;
    }
  }
  num++;
  }
  console.log(`toMemo : ${toMemo}`);
  if(lesson[5]){
		passage.innerHTML=`<div style="width:300px;margin:0 auto;color:#282828;">${lesson[5]}<div id="ok" style="margin-top:25px;text-align:center;"><i class="fi fi-br-cross"></i></div></div>`;
		document.querySelector('#ok').addEventListener('click',function(){
			passage.innerHTML='';	
      memo(toMemo);
		});
  }
  else{
    memo(toMemo);
  }
}
function memo(toMemo){
  if(toMemo.length===0){
    solve();
  }
  else{
    passage.innerHTML=`<div style="margin:0 auto;color:#282828;"><div class="shadow-boxing" style="text-align:center;"><h2 style="text-align:center;">${toMemo[0][0]}</h2><br>${toMemo[0][1]}</div><div id="next" style="margin-top:25px;text-align:center;"><i class="fi fi-br-angle-right"></i></div></div>`;
    document.querySelector('#next').addEventListener('click',function(){
      document.getElementById('passage').innerHTML='';
      memo(toMemo.slice(1));
    });
  }
}
function solve(){
  if(remain===0){
    document.getElementById('passage').textContent='끝';
  }
  else{
    var type=Math.floor(Math.random()*3);
    if(limit[type]===0){
      type=(type+1)%3;
    }
    if(limit[type]===0){
      type=(type+1)%3;
    }
    var index=Math.floor(Math.random()*limit[type]);
    var i=toSolve[type][index];
    var j='';
    var n=0;
    var rev=Math.floor(Math.random()*2);
    
    //뒤집을지 여부
    switch(rev){
      case 0 : break;
      case 1 :
        j=i[0];
        i[0]=i[1];
        i[1]=j;
        break;
    }
    //문제 유형
    switch(Math.floor(Math.random()*2)){
      case 0 : write(i[rev],i[1-rev]); break;
      case 1:
        if(toSolve[type].length>=4){
          var opt=[];
          n=0;
          opt.push(i[1]);
          while(n<3){
            var ran=Math.floor(Math.random()*limit[type]);
            while(opt.includes(wordsList[type][ran][1-rev])){
              ran=Math.floor(Math.random()*limit[type]);
            }
              opt.push(wordsList[type][ran][1-rev]);
          }
          choose(i[rev],opt,i[1-rev]);
        }
        else{
          write(i[rev],i[1-rev]);
        }
        break;
    }
    remain--;
  }
}
function write(pas,ans){
  
}
function choose(pas,opt,ans){
  
}