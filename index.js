if(new URL(window.location.href).searchParams.get('lang')){
	lessonsDataSet();
}
else{
  langsListSet();
}
var langsList=[];
var lessonsList=[];
var wordsList=[[],[],[]];
var limit=[];
var toSolve=[[],[],[]];
var noSeen=[[],[],[]];
var remain=0;
var cor=0;
var inc=0;

function langsListSet(){
  fetch('https://sheets.googleapis.com/v4/spreadsheets/14kwQv_6Krk9wAlf1-d6exL7X-9nRsRZqppNCTuCw_rM/values/langs!A:F?key=AIzaSyATLeHQh6kM0LWRJjLg8CmzoSdnntFrmFk')
  .then(response=>response.json())
  .then(data=>{
    langsList=data.values;
    const langsListBox = document.getElementById('langs_list');
    let i='';
    langsList.forEach(row => {
      i+=`<div class="shadow-boxing" data-lang="${row[0]}">`;
      if(row[4]){
      i+=`<div class="image-boxing">
        <img src="${row[4]||''}" style="width:100%;">
        </div>`;
      }
      i+=`<div style="padding:10px;">
        <sup>${row[0]}</sup><h2 style="display:inline-block;">${row[1]}</h2>
        <p>${row[2]}</p>
        <div style="margin:0;margin-top:auto;padding:0;padding-right:10px;color:#969696;text-align:right;"><i>${row[3]||''}</i></div>
        </div>
      </div>`;
    });
    langsListBox.innerHTML=i;
    document.querySelectorAll('.shadow-boxing').forEach(element=>{
      element.addEventListener('click',function(){
        const lang=this.getAttribute('data-lang');
        langsListBox.innerHTML='';
        history.pushState(null,'',`?lang=${lang}`);
        lessonsDataSet();
      });
    });
  });
}
function lessonsDataSet(){
  fetch('https://sheets.googleapis.com/v4/spreadsheets/14kwQv_6Krk9wAlf1-d6exL7X-9nRsRZqppNCTuCw_rM/values/langs!A:F?key=AIzaSyATLeHQh6kM0LWRJjLg8CmzoSdnntFrmFk')
  .then(response=>response.json())
  .then(data1=>{
    langsList=data1.values;
    let lang=langsList[langsList.findIndex(row=>row[0]===new URL(window.location.href).searchParams.get('lang'))][5];
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${lang}/values/lessons!A:F?key=AIzaSyATLeHQh6kM0LWRJjLg8CmzoSdnntFrmFk`)
    .then(response=>response.json())
    .then(data2=>{
      lessonsList=data2.values;
      lessonsListSet();
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
function lessonsListSet(){
  var lessonsListBox=document.getElementById('lessons_list');
  var color=[255,180,0]
  var step=1;
  lessonsList.forEach(row=>{
    switch(step){
      case 1: color[0]-=51/4;
              color[2]+=16/4;
              if(color[0]===0){
                step++;
              }
              break;
      case 2: color[1]-=20/4;
              color[2]+=35/4;
              if(color[1]===0){
                step++;
              }
              break;
      case 3: color[0]+=51/4;
              color[1]-=16/4;
              color[2]-=35/4;
              if(color[0]===255){
                step++;
              }
              break;
    }
    lessonsListBox.innerHTML+=`<div class="lesson-boxing"  data-lesson=${encodeURIComponent(row[0])} style="background-color:rgb(${color[0]},${color[1]},${color[2]},0.5)">
      <span style="margin-left:10px;">${row[0]}</>
    </div>`;
  });
  document.querySelectorAll('.lesson-boxing').forEach(element=>{
    element.addEventListener('click',function(){
      const lesson=lessonsList[lessonsList.findIndex(row=>row[0]===decodeURIComponent(this.getAttribute('data-lesson')))];
      lessonsListBox.innerHTML='';
      //history.pushState(null,'',`?lang=${lang}`);
      lessonStart(lesson);
    });
  });
}

function lessonStart(lesson){
	var passage=document.getElementById('passage');
  var toMemo=[];
  var num=1;
  remain=Number(lesson[4]);
  cor=0;
  inc=0;
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
  else{
    limit.push(0);
  }
  num++;
  }
  noSeen=JSON.parse(JSON.stringify(toSolve));
  console.log(`toMemo : ${toMemo}`);
  if(lesson[5]){
		passage.innerHTML=`<div style="width:300px;margin:0 auto;color:#282828;">${lesson[5]}<div id="ok" style="margin-top:25px;text-align:center;"><i class="fi fi-br-arrow-right"></i></div></div>`;
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
    passage.innerHTML=`<div style="margin:0 auto;color:#282828;"><div class="shadow-boxing" style="text-align:center;"><h2 style="text-align:center;margin-top:40px;">${toMemo[0][0]}</h2><br>${toMemo[0][1]}</div><div id="next" style="margin-top:25px;text-align:center;"><i class="fi fi-br-angle-right"></i></div></div>`;
    document.querySelector('#next').addEventListener('click',function(){
      document.getElementById('passage').innerHTML='';
      memo(toMemo.slice(1));
    });
  }
}
function solve(){
  if(remain===0){
    document.getElementById('passage').innerHTML=`<div class="shadow-boxing"><p style="text-align:center;margin-top:60px;">총 <b>${cor+inc}</b>개의 문제 중 <b>${cor}</b>개를 맞추셨습니다!</p></div><div id="next" style="margin-top:25px;text-align:center;"><i class="fi fi-br-arrow-right"></i></div>`;
    document.getElementById('input').textContent='';
    document.querySelector('#next').addEventListener('click',nextClick);
    function nextClick(){
      document.querySelector('#next').removeEventListener('click',nextClick);
      document.getElementById('passage').textContent='';
      lessonsListSet();
    }
  }
  else{
    var type;
    if([...noSeen[0],...noSeen[1],...noSeen[2]].length===0){
      type=Math.floor(Math.random()*3);
      var i=toSolve[type][Math.floor(Math.random()*toSolve[type].length)];
    }
    else{
      type=Math.floor(Math.random()*3);
      if(noSeen[type].length===0){
        type++;
	type=type%3;
      }
      if(noSeen[type].length===0){
        type++;
	type=type%3;
      }
      var i=noSeen[type][Math.floor(Math.random()*noSeen[type].length)];
      noSeen[type]=[...noSeen[type].slice(0,noSeen[type].indexOf(i)),...noSeen[type].slice(noSeen[type].indexOf(i)+1)];
    }
    var j='';
    var n=0;
    var rev=Math.floor(Math.random()*2);
    //문제 유형
    switch(Math.floor(Math.random()*2)){
      case 0 : write(i[rev],i[1-rev],type); break;
      case 1:
        if(toSolve[type].length>=4){
          var opt=[];
          n=0;
          while(n<3){
            var ran=Math.floor(Math.random()*(limit[type]+1));
            while(opt.includes(wordsList[type][ran][1-rev])||wordsList[type][ran][1-rev]===i[1-rev]){
              ran=Math.floor(Math.random()*(limit[type]+1));
            }
            opt.push(wordsList[type][ran][1-rev]);
            n++;
          }
          choose(i[rev],opt,i[1-rev]);
        }
        else{
          write(i[rev],i[1-rev],type);
        }
        break;
    }
    remain--;
  }
}
function write(pas,ans,type){
  document.getElementById('passage').innerHTML=`<div class="passage-boxing" style="text-align:center;"><h2 style="display:inline-block;margin-top:25px;color:#282828;">${pas.split('//')[0]}</h2></div>`;
  document.getElementById('input').innerHTML=`<div id="ans" class="option-boxing" style="padding-top:5px;"><input id="text" type="text"></div><div id="check" style="margin-top:25px;text-align:center;"><i class="fi fi-br-check"></i></div>`;
  document.querySelector('#check').addEventListener('click',checkClick);
  function checkClick(){
    if(type===2){
      var isAns=0;
      ansSet=new Set(ans.split(/\/\//).map((el)=>el.replace(/[\.,\?\!\s]/g, '')));
      for(el of ansSet){
      //정답
      if(document.getElementById('text').value.replace(/[\.,\?\!\s]/g, '')===el){
        isAns++;
        cor++;
        document.getElementById('ans').className='correct-boxing';
        break;
      }
      }
      //오답
      if(isAns==0){
        inc++;
        document.getElementById('ans').className='incorrect-boxing';
      }
    }
    else{
      var isAns=0;
      ansSet=new Set(ans.split(/,\s*/));
      inpSet=new Set(document.getElementById('text').value.split(/,\s*/));
      for(el of inpSet){
        //오답
        if(!ansSet.has(el)){
          isAns++;
          inc++;
          document.getElementById('ans').className='incorrect-boxing';
          break;
        }
      };
      if(isAns===0){
        cor++;
        document.getElementById('ans').className='correct-boxing';
      }
    }
    this.innerHTML=`<p style="text-align:center;">${ans.split('//')[0]}</p><div id="next" style="margin-top:25px;text-align:center;"><i class="fi fi-br-arrow-right"></i></div>`;
    document.querySelector('#check').removeEventListener('click',checkClick);
    document.querySelector('#next').addEventListener('click',nextClick);
  }
  function nextClick(){
    document.querySelector('#next').removeEventListener('click',nextClick);
    document.getElementById('ans').className='option-boxing';
    solve();
  }
}
function choose(pas,opt,ans){
  var ran=Math.floor(Math.random()*4);
  opt=[...opt.slice(0,ran),ans,...opt.slice(ran)];
  document.getElementById('passage').innerHTML=`<div class="passage-boxing" style="text-align:center;"><h2 style="display:inline-block;margin-top:25px;color:#282828;">${pas.split('//')[0]}</h2></div>`;
  document.getElementById('input').innerHTML='';
  while(opt.length>0){
    document.getElementById('input').innerHTML+=`<div id="${opt[0]}" class="option-boxing" style="padding-left:20px;">${opt[0].split('//')[0]}</div>`;
    opt=opt.slice(1);
  }
  document.querySelectorAll('.option-boxing').forEach(element=>{
    element.addEventListener('click',function(){
      //정답
      if(this.id===ans){
        cor++;
      }
      //오답
      else{
        inc++;
        this.className='incorrect-boxing';
      }
      document.getElementById(ans).className='correct-boxing';
      document.getElementById('input').innerHTML+=`<div id="next" style="margin-top:25px;text-align:center;"><i class="fi fi-br-arrow-right"></i></div>`;
      document.querySelector('#next').addEventListener('click',nextClick);
      element.removeEventListener('click',arguments.callee);
    });
  });
  function nextClick(){
    document.querySelector('#next').removeEventListener('click',nextClick);
    solve();
  }
}
