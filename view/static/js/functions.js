function post(endpt, args, takesArgs, callback) {
  const http = new XMLHttpRequest();
  if (takesArgs) {
    const data = new FormData();
    for (let k in args) {
      data.append(k, args[k]);
    }
    http.open("POST", endpt);
    http.send(data)
  } else {
    http.open("POST", endpt);
    http.send();
  }

  http.onreadystatechange = function() {
    if (http.readyState === 4 && http.status === 200) {
      let response = http.responseText;
      console.log(response);
      let json = JSON.parse(http.response);
      callback(json);
    }

  }
}

function get(endpt, callback) {
  const http = new XMLHttpRequest();

  http.open("GET", endpt, true);
  http.send();

  http.onreadystatechange = function() {
    if (http.readyState === 4 && http.status === 200) {
      var response = http.responseText;
      callback(response);
    }

  }
}

function toggleLightMode(){
  document.body.classList.toggle('light-mode')
  for (tag of document.getElementsByClassName('tag')){
    tag.classList.toggle('light-mode')
  }
}

var currProject = "StartupCentral"

var projectURL = "/static/assets/oop.jpg"
var collabURL= "/static/assets/linked_in_pfp.jpeg"
function getCurrProject(){
  get('/getProject/' + currProject, json =>{
    let result = JSON.parse(json)
    return {'name': result['project'], 'tags': result['tags'], 'collabs' : result['developerList'], 'desc': result['description']}
  })
}

function getRecommendedProjects(projName){
  get('/getProjRecommendations/' + name, json => {
    return {'name': result['project'], 'tags': result['tags'], 'collabs' : result['developerList'], 'desc': result['description']}
  })
}

function getUserData(name){
  get('/getProfile/' + name, json => {
    let result = JSON.parse(json)
    console.log(json)
    return {}
  })
}

function setUp_homePage(){
  let currProjectTitle = document.getElementById('curr-project-name');
  let currDesc = document.getElementById('curr-project-description')
  let tagBox = document.getElementById('tag-box');
  let reccommendBox = document.getElementById('reccomendations');
  let collabBox = document.getElementsByClassName('col-scroll-wrapper')[0]
  let currProj = getCurrProject();
  currProjectTitle.innerText = currProj['name']
  currDesc.innerText = currProj['desc']
  for (project of getRecommendedProjects()){
    reccommendBox.appendChild(newRecommendationTile(project['name'],project['desc'],projectURL))
  }
  for (c_name of currProj['collabs']){
    let collab = getUserData(c_name)
    collabBox.appendChild(newColTile(collab['name'],collab['tags'],collabURL))
  }
  loadPageTags(currProj['tags'], document.getElementById('tag-box'))
}

function search(search_string){
  let results = document.getElementById('search-results')
  if(search_string === ''){
    for (project of getRecommendedProjects()){
      results.appendChild(newSearchResult(project['name'],project['desc'],project['tags'],project['collabs'],projectURL))
    }
  }
  else{
    get('/getProjNames',search => {
      for (project of search){
        results.appendChild(newSearchResult(project['name'],project['desc'],project['tags'],project['collabs'],projectURL))
      }
    })
  }
}