if(new URL(window.location.href).searchParams.get('lang')){
	lessonsListSet();
}
else{
  langsListSet();
}
var langsList=[];
var lessonsList=[];
var wordsList=[];
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
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${lang}/values/lessons!A:D?key=AIzaSyATLeHQh6kM0LWRJjLg8CmzoSdnntFrmFk`)
    .then(response=>response.json())
    .then(data2=>{
      lessonsList=data2.values;
      var lessonsListBox=document.getElementById('lessons-list');
      lessonsList.forEach(row=>{
        lessonsListBox.innerHTML+=`<div class="shadow-boxing">
          <h2 style="display:inline-block;">${row[0]}</h2>
        </div>`;
      });
    });
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${lang}/values/words!A:D?key=AIzaSyATLeHQh6kM0LWRJjLg8CmzoSdnntFrmFk`)
    .then(response=>response.json())
    .then(data3=>{
      wordsList=data3.values;
    });
  });
}
