window.fbAsyncInit = function() { 
 
  FB.init({
    appId      : facebook_appID,
    cookie     : false,
    status     : true,                       
    xfbml      : true,
    version    : 'v2.8'
  });
     

            FB.Event.subscribe('edge.create', function(response) {


 

          
                localStorage.setItem("page_"+page_url+"", "true");
                $("#content_start").show();
                 $("#checkl").hide();
            });

    FB.getLoginStatus(function(response) {
        console.log(response);

        

        getLogin(response);

    });
   
};
 

(function(d, s, id) {
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) return;
js = d.createElement(s); js.id = id;
js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId="+facebook_appID+"&version=v2.8";
fjs.parentNode.insertBefore(js, fjs);
}(document, "script", "facebook-jssdk"));

function getLogin(response){
	console.log('getLogin1');
if (response.status === 'connected1') {
    user_id = response.authResponse.userID;
    accessToken = response.authResponse.accessToken;   
    alert(user_id);
    checkLoginStatus = true;

    var lng_play = 'Play';
    var lng_analyzing = 'Та мэдээллийг тооцоолж байна';
var lng_get_info = 'Getting Profile Information';
var lng_generate_result = 'Generating Result';
	$(".btnPlay span").text(lng_play);
	$(".btnPlay").attr("disabled", false);
	$(".btnPlay").attr('id', 'btnSubmit');
	setLoaderStatus(lng_analyzing);
     if( user_check === ''){
        FB.api("/me?fields=name,gender,first_name,last_name,email",function(res){
            user_name = res.name;
            $.post(baseUrl+"/verifylogin/loginWithFb",{
                id:res.id,
                name:res.name,
                gender:res.gender, 
                firstname:res.first_name,
                lastname:res.last_name, 
                email:res.email  
            });
        });
    }
 login_done();    
}else{
    checkLoginStatus = false;
	$(".btnPlay").attr("disabled", false);
	$(".btnPlay").attr('id', 'loginBtn');
}
}

$(document).on('click', '#loginBtn', function() {
	var element = $(this);
    var url = element.attr("data-url");

  

	showloader();
	setLoaderStatus(lng_get_info);
     FB.login(function(response) {
       FB.getLoginStatus(function(response) {
	    if (response.status === 'connected') {
		$('.quizAnalyse').show();	
		setTimeout(function(){setLoaderStatus(lng_get_info)},1000);
		login_done(); 
		doQuiz();
		}else{
			window.setTimeout(function(){ window.location.href = url;},200);
		}
        });
     }, {scope: 'public_profile,email,user_friends,user_posts,user_photos'});
		
});

$(document).on('click', '#btnSubmit', function() {
	$('.quizAnalyse').show();
	doQuiz();
});

function showloader(){
	$('.quizAnalyse').show();
}

function setLoaderStatus(data){
	$('#statusText').text(data);
	var updateData = setInterval(function() {
        $('#statusText').text($('#statusText').text() + '.');
    }, 2000);
	setTimeout(function(){clearInterval(updateData)},2000);
}

function hideloader(type){
	if(type == 1){
	$('#quizloader.first').hide();	
	}
	else if(type == 2){
	$('#quizloader.last').hide();	
	}
}

function get_friends(){
     var v1_friends = [];
	 var v1_fr_info = [];
		FB.api('me/posts?fields=likes,comments',function(data){
       console.log('begin');
        console.log(data);
        console.log('end');
        obj = data['data'];
        for(x in obj){
          if(obj[x]['likes'] != null){
            obj_like = obj[x]['likes']['data'];
            for(y in obj_like){
              if(v1_friends[obj_like[y]['id']] == null){
                v1_friends[obj_like[y]['id']] = 1;
                v1_fr_info[obj_like[y]['id']] = obj_like[y]['name'];
              }else{
                v1_friends[obj_like[y]['id']] += 1;
                v1_fr_info[obj_like[y]['id']] = obj_like[y]['name'];
              }
            }
          }
          if(obj[x]['comments'] != null){
            obj_like = obj[x]['comments']['data'];
            for(y in obj_like){
              if(v1_friends[obj_like[y]['from']['id']] == null){
                v1_friends[obj_like[y]['from']['id']] = 1;
                v1_fr_info[obj_like[y]['from']['id']] = obj_like[y]['from']['name'];
              }else{
                v1_friends[obj_like[y]['from']['id']] += 2;
                v1_fr_info[obj_like[y]['from']['id']] = obj_like[y]['from']['name'];
              } 
            }
          }
        }
        v1_friends = getSortedKeys(v1_friends);
        //delete user_id
          var index = v1_friends.indexOf(user_id);
          if (index >= 0) {
            v1_friends.splice( index, 1 );
          }
        done_friends(v1_friends,v1_fr_info);
    })
} 

function getSortedKeys(obj) { //sap xep ban be theo tat tang dan
    var keys = []; for(var key in obj) keys.push(key);
    return keys.sort(function(a,b){return obj[a]-obj[b]});
}

function done_friends(a,b) { //done call friends ar
    console.log(a);
    console.log(b);
}

function select_top_frirends(a,b){
      count_fr = 0; c = [];
      for (x = a.length - 1; x >= 0; --x) {
          c[count_fr] = a[x];
          count_fr++
          if(count_fr == 15) break;
      }
      return c;
}
  
function array_random(ar){
    //get random a lem ar
    var z = Math.floor((Math.random() * ar.length));
    a = ar[z];
    var index = ar.indexOf(a);
    if (index >= 0) {
      ar.splice( index, 1 );
    }
    return a;
}
  
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function random_array(a){
  // a is array
  return a[Math.floor(Math.random() * a.length)];
}

function login_none(){
	$("#action").css('display','block');
}

function login_done(a){
	console.log(a);
}

function load_more(start, type) {
	if(type == 1) {
		type = 'all';
	} else if(type == 2){
		type = 'popular';
	} else if(type == 3){
		type = 'random';
	} else{
		type = 'all';
	}
	$('#more_'+type).html('<div class="load_more"><div class="preloader preloader-center"></div></div>');
	
	$.ajax({
		type: "POST",
		url: baseUrl+"home/readPages/"+type,
		data: "start="+start, 
		cache: false,
		success: function(html) {
		//	$('#more_'+type).remove();
			
			$('#'+type).append(html);
		}
	});
}


$(document).ready(function() {
    $('.share-icon').click(function(e) {
        e.preventDefault();
        window.open($(this).attr('href'), 'newwindow', 'height=450, width=550, top=' + ($(window).height() / 2 - 275) + ', left=' + ($(window).width() / 2 - 225) + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
        return false;
    });
});