if(new URL(window.location.href).searchParams.get('lang')){
	lessonsListSet();
}
else{
  langsListSet();
}
var langsList=[];
var lessonsList=[];
var wordsList=[];
var variantsList=[];
var sentencesList=[];

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
      wordsList=data3.values;
    });
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${lang}/values/words!C:E?key=AIzaSyATLeHQh6kM0LWRJjLg8CmzoSdnntFrmFk`)
    .then(response=>response.json())
    .then(data4=>{
      variantsList=data4.values;
    });
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${lang}/values/words!F:G?key=AIzaSyATLeHQh6kM0LWRJjLg8CmzoSdnntFrmFk`)
    .then(response=>response.json())
    .then(data5=>{
      sentencesList=data5.values;
    });
  });
}
function lessonStart(lesson){
	var passage=document.getElementById('passage');
  var toMemo=[];
  var num=1;
  while(num<=3){
  if(lesson[num]!=='0'){
    var i=Number(lesson[num].split('-')[0])-1;
    if(lesson[num].split('-')[1]){
      var j=Number(lesson[num].split('-')[1])-1;
    }
    else{
      var j=i;
    }
    switch(num){
      case 1 : var type=wordsList; break;
      case 2 : var type=variantsList.map((row)=>row.slice(1,3)); break;
      case 3 : var type=sentencesList.map((row)=>row.slice(1,3)); break;
    }
    while(i<=j){
      toMemo.push(type[i])
      i++;
    }
  }
  num++;
  }
  console.log(`toMemo : ${toMemo}`)
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
    return;
  }
  else{
    passage.innerHTML=`<div style="margin:0 auto;color:#282828;"><div class="shadow-boxing" style="text-align:center;"><h2 style="text-align:center;">${toMemo[0][0]}</h2><br>${toMemo[0][1]}</div><div id="next" style="margin-top:25px;text-align:center;"><i class="fi fi-br-angle-right"></i></div></div>`;
    document.querySelector('#next').addEventListener('click',function(){
      document.getElementById('passage').innerHTML='';
      memo(toMemo.slice(1));
    });
  }
}
