var isstreaming = false;
var now_playing_index = 0;
var displaying = "songs";

/*
function playSound(soundindex){
    console.log(soundindex);
    if (queue[soundindex]['isplaying']===false){
        if(isstreaming == true){
            mySound.pause()
            queue[now_playing_index]['isplaying'] = false;
            isstreaming = false;
            $('#list2 li').eq(now_playing_index).removeClass("playing");
            $('#list2 li').eq(now_playing_index).removeClass("paused");
        }
        mySound = soundManager.createSound({
            id: 'track_' + queue[soundindex]['id'],
            url: queue[soundindex]['url'] + "?consumer_key=" + clientid,
            autoplay: false
        });
        soundManager.play(mySound.id, {
            multiShotEvents: true,
            onfinish: function(){
                queue[soundindex]['isplaying'] = false;
                isstreaming = false;
                $('#list2 li').eq(now_playing_index).removeClass("playing");
                $('#list2 li').eq(now_playing_index).removeClass("paused");
                if(soundindex < queue.length){
                    playSound(soundindex + 1)
                }
            }
        });
        queue[soundindex]['isplaying'] = true;
        isstreaming = true;
        $('#list2 li').eq(soundindex).removeClass("paused").addClass("playing");       
    }
    else if (queue[soundindex]['isplaying']=== true){
        mySound.pause();
        queue[soundindex]['isplaying'] = fal;
        isstreaming = false;
        $('#list2 li').eq(now_playing_index).removeClass("playing").addClass("paused");
    }
    now_playing_index = soundindex;
}*/

//--------------------------------------------------------------------||
//Below are the event listeners that control folder uploading
/*$("#fileURL").change(function(){

});*/

$('input[type=file]').change(function(e){
    files = e.target.files;
    for (var i = 0, len = files.length; i < len; i++) {
        file = files[i];
        console.log(file.webkitRelativePath);
        extension = file.name.split(".").pop();       
    }
    file = files[40];
    var objectURL = window.URL.createObjectURL(file);
    console.log('created object url: %o', objectURL);
    mySound = soundManager.createSound({
            id: 'track_'+files[40].name,
            url: objectURL,
            autoplay: false
    });
    soundManager.play(mySound.id, {
            multiShotEvents: true
    });   
    //create new html5 audio element with this url
   /* var audio = $('<audio />', {
        src: objectURL,
        autoplay: 'autoplay',
        controls: 'controls',
        preload: 'auto'            
    });
   console.log('created audio element:%o', audio);
   $("body").append(audio);*/


   
  //  if (file.type.match(/audio.*/)) {
    //    var reader = new FileReader();
      //  reader.onload = function(d) {
        //    mySound = soundManager.createSound({
  //              id: 'track_'+files[40].name,
    //            url: d.result
     //       });
  //          soundManager.play(mySound.id, {
    //            multiShotEvents: true
      //      });
  //      }
   //     reader.readAsDataURL(file);
   // }; 
});





//--------------------------------------------------------------------||


//Upon loading the document a mainlist and queue array are initialized.
//The mainlist is filled with artists to display by triggering an artists click
//soundManager is also initialized.
$(document).ready(function() {
    mainlist = new Array();
    queue = new Array();
    $("#artists").trigger('click');

    soundManager.setup({
        url: '/path/to/swf-directory/',
        onready: function() {
          // SM2 has loaded, API ready to use e.g., createSound() etc.
        },
        ontimeout: function() {
          // Uh-oh. No HTML5 support, SWF missing, Flash blocked or other issue
        }
    });
});


//Handles resizing of the webpage
$(window).resize(function(){
    var col1 = $('#list1div');
    var col2 = $('#list2div');
    var colsep = $('#colsep');
    if (col1.height() < col2.height()){
        colsep.height(col2.height());
    }
    else {
        colsep.height(col1.height());
    }
    colsep.offset(col2.offset());
}).resize();

//Relies on the order of list 1 corresponding to the order of
//mainlist
$(document).on('click', '#list1 li', function(){
    var list2 = $('#list2');    
    console.log("Browse Element Clicked");
    if (displaying == "songs"){
        if($(this).attr("title") != "true"){
            list2.append($(this).clone());
            $(this).attr("title", "true");
            $(window).trigger('resize');
        } 
    }
    else{
        name = $(this).html();
    }
    if (displaying == "playlists"){
        console.log("ERROR: SITE DOES NOT SUPPORT PLAYLIST BROWSING YET");
    }
    if (displaying == "genres"){
        console.log("ERROR: SITE DOES NOT SUPPORT GENRE BROWSING YET");
    }
    if (displaying == "artists"){
        console.log("ERROR: SITE DOES NOT SUPPORT ARTIST BROWSING YET");
    }
    if (displaying == "albums"){
        console.log(name);
        if(name == "<p> Aquemini </p>"){
            $("#list1").empty();
            $("#list1").append("<li><p>Hold On, Be Strong (featuring The Four Phonics)<small>Outkast</small></p></li><li><p>Return of the 'G'<small>Outkast</small></p></li><li><p>Rosa Parks<small>Outkast</small></p></li><li><p>Skew It on the Bar-B (featuring Raekwon)<small>Outkast</small></p></li><li><p>Aquemini<small>Outkast</small></p></li><li><p>Synthesizer (featuring George Clinton)<small>Outkast</small></p></li><li><p>Slump (featuring BackBone and Cool Breeze)<small>Outkast</small></p></li><li><p>West Savannah<small>Outkast</small></p></li><li><p>Da Art of Storytellin' (Pt. 1)<small>Outkast</small></p></li><li><p>Da Art of Storytellin' (Pt. 2)<small>Outkast</small></p></li><li><p>Mamacita (featuring Masada and Witchdoctor)<small>Outkast</small></p></li><li><p>SpottieOttieDopaliscious (featuring Pat Brown)<small>Outkast</small></p></li><li><p>Y'All Scared (featuring T-Mo, Big Gipp and Khujo)<small>Outkast</small></p></li><li><p>Nathaniel<small>Outkast</small></p></li><li><p>Liberation (featuring Cee-Lo, Erykah Badu and Big Rube)<small>Outkast</small></p></li><li><p>Chonkyfire<small>Outkast</small></p></li>");     
            displaying = "songs";
        }
        if(name == "<p> Stankonia </p>"){
            $("#list1").empty();
            $("#list1").append("<li><p>Intro<small>Outkast</small></p></li><li><p>Gasoline Dreams (featuring Khujo)<small>Outkast</small></p></li><li><p>I'm Cool (Interlude)<small>Outkast</small></p></li><li><p>So Fresh, So Clean<small>Outkast</small></p></li><li><p>Ms. Jackson<small>Outkast</small></p></li><li><p>Snappin' & Trappin' (featuring Killer Mike and J-Sweet)<small>Outkast</small></p></li><li><p>D.F. (Interlude)<small>Outkast</small></p></li><li><p>Spaghetti Junction<small>Outkast</small></p></li><li><p>Kim & Cookie (Interlude)<small>Outkast</small></p></li><li><p>I'll Call Before I Come (featuring Gangsta Boo and Eco)<small>Outkast</small></p></li><li><p>B.O.B<small>Outkast</small></p></li><li><p>Xplosion (featuring B-Real)<small>Outkast</small></p></li><li><p>Good Hair (Interlude)<small>Outkast</small></p></li><li><p>We Luv Deez Hoez (featuring Backbone and Big Gipp)<small>Outkast</small></p></li><li><p>Humble Mumble (featuring Erykah Badu)<small>Outkast</small></p></li><li><p>Drinkin\' Again (Interlude)<small>Outkast</small></p></li><li><p>?<small>Outkast</small></p></li><li><p>Red Velvet<small>Outkast</small></p></li><li><p>Cruisin' in the ATL (Interlude)<small>Outkast</small></p></li><li><p>Gangsta Shit (featuring Slimm Calhoun, Blackowned C-Bone and T-Mo)<small>Outkast</small></p></li><li><p>Toilet Tisha<small>Outkast</small></p></li><li><p>Slum Beautiful (featuring Cee Lo Green)<small>Outkast</small></p></li><li><p>Pre-Nump (Interlude)<small>Outkast</small></p></li><li><p>Stankonia (Stanklove) (featuring Big Rube and Sleepy Brown)<small>Outkast</small></p></li>");
            displaying = "songs";
        }
        if(name == "<p> The College Dropout </p>"){
            $("#list1").empty();
            $("#list1").append("<li><p>Intro<small>Kanye West</small></p></li><li><p>We Don't Care<small>Kanye West</small></p></li><li><p>Graduation Day<small>Kanye West</small></p></li><li><p>All Falls Down (featuring Syleena Johnson)<small>Kanye West</small></p></li><li><p>I'll Fly Away<small>Kanye West</small></p></li><li><p>Spaceship (featuring GLC and Consequence)<small>Kanye West</small></p></li><li><p>Jesus Walks<small>Kanye West</small></p></li><li><p>Never Let Me Down (featuring Jay-Z and J. Ivy)<small>Kanye West</small></p></li><li><p>Get Em High (featuring Talib Kweli and Common)<small>Kanye West</small></p></li><li><p>Workout Plan<small>Kanye West</small></p></li><li><p>The New Workout Plan<small>Kanye West</small></p></li><li><p>Slow Jamz (featuring Twista and Jamie Foxx)<small>Kanye West</small></p></li><li><p>Breathe In Breathe Out (featuring Ludacris)<small>Kanye West</small></p></li><li><p>School Spirit (Skit 1)<small>Kanye West</small></p></li><li><p>School Spirit<small>Kanye West</small></p></li><li><p>School Spirit (Skit 2)<small>Kanye West</small></p></li><li><p>Lil Jimmy (Skit)<small>Kanye West</small></p></li><li><p>Two Words (featuring Mos Def, Freeway and the Boys Choir of Harlem)<small>Kanye West</small></p></li><li><p>Through the Wire<small>Kanye West</small></p></li><li><p>Family Business<small>Kanye West</small></p></li><li><p>Last Call<small>Kanye West</small></p></li>");
            displaying = "songs";
        }
    }
});

//Clicking on an element in the play queue will delete it 
$(document).on('click', '#list2 li', function(){
    $(this).remove();
});

//***********************************************************************\\
//***********************************************************************\\
//Below are the event listeners for the Browse Menu's side panel
//Each one will clear and update the Browse Menu's display
$("#playlists").on("click", function(){
    console.log("playlists clicked");
    $('#list1').empty();
    $('#list1').append("<li><p> Chilling </p></li><li><p> Dingus Status Swag </p></li><li><p> Happy </p></li><li><p> Running </p></li><li><p> Party </p></li>");
    displaying = "playlists";
});
$("#artists").on("click", function(){
    console.log("artists clicked");
    $('#list1').empty();
    $('#list1').append("<li><p> Arcade Fire </p></li><li><p> Arctic Monkeys </p></li><li><p> The Beach Boys </p></li><li><p> The Beatles </p></li><li><p> Bob Dylan </p></li><li><p> The Clash </p></li><li><p> Disclosure </p></li><li><p> The Doors </p></li><li><p> Florence and The Machine </p></li><li><p> George Harrison </p></li><li><p> Gnarles Barkley </p></li><li><p> Gorillaz </p></li><li><p> Kanye West </p></li><li><p> The Kinks </p></li><li><p> LCD Soundsystem </p></li><li><p> Marvin Gaye </p></li><li><p> Nirvana </p></li><li><p> Outkast </p></li><li><p> The Notorious B.I.G. </p></li><li><p> The Smiths </p></li><li><p> Todd Terje </p></li><li><p> Wu-Tang Clan </p></li><li><p> The xx </p></li>");
    displaying = "aritsts";
});
$("#genres").on("click", function(){
    console.log("genres clicked");
    $('#list1').empty();
    $('#list1').append("<li><p> Ambient </p></li><li><p> Classical </p></li><li><p> Country </p></li><li><p> Dance </p></li><li><p> Electronic </p></li><li><p> Southern Slang </p></li><li><p> R & B </p></li><li><p> Rock & Roll </p></li><li><p> World Music </p></li>");
    displaying = "genres";
});
$("#albums").on("click", function(){
    console.log("albums clicked");
    $('#list1').empty();
    $('#list1').append("<li><p> Funeral </p></li><li><p> Reflektor </p></li><li><p> Whatever People Say I Am, That's What I'm Not </p></li><li><p> Pet Sounds </p></li><li><p> Abbey Road </p></li><li><p> Sgt. Pepper's Lonely Hearts Club Band </p></li><li><p> Blonde on Blonde </p></li><li><p> Highway 61 Revisited </p></li><li><p> The Clash </p></li><li><p> London Calling </p></li><li><p> You & Me (Flume) </p></li><li><p> The Doors </p></li><li><p> I Need Your Love </p></li><li><p> All Things Must Pass </p></li><li><p> Crazy </p></li><li><p> Demon Days </p></li><li><p> My Beautiful Dark Twisted Fantasy </p></li><li><p> Something Else by The Kinks </p></li><li><p> Losing My Edge </p></li><li><p> The College Dropout </p></li><li><p> What's Goin On? </p></li><li><p> In Utero </p></li><li><p> Nevermind </p></li><li><p> Ready to Die </p></li><li><p> Aquemini </p></li><li><p> The Love Below </p></li><li><p> Stankonia </p></li><li><p> The Queen is Dead </p></li><li><p> It's The Arps </p></li><li><p> Spiral </p></li><li><p> Enter The Wu-Tang: 36 Chambers </p></li>");
    displaying = "albums";
});
$("#songs").on("click", function(){
    console.log("songs clicked");
    $('#list1').empty();
    $('#list1').append("<li><p>Intro<small>Outkast</small></p></li><li><p>Gasoline Dreams (featuring Khujo)<small>Outkast</small></p></li><li><p>I'm Cool (Interlude)<small>Outkast</small></p></li><li><p>So Fresh, So Clean<small>Outkast</small></p></li><li><p>Ms. Jackson<small>Outkast</small></p></li><li><p>Snappin\' & Trappin\' (featuring Killer Mike and J-Sweet)<small>Outkast</small></p></li><li><p>D.F. (Interlude)<small>Outkast</small></p></li><li><p>Spaghetti Junction<small>Outkast</small></p></li><li><p>Kim & Cookie (Interlude)<small>Outkast</small></p></li><li><p>I'll Call Before I Come (featuring Gangsta Boo and Eco)<small>Outkast</small></p></li><li><p>B.O.B<small>Outkast</small></p></li><li><p>Xplosion (featuring B-Real)<small>Outkast</small></p></li><li><p>Good Hair (Interlude)<small>Outkast</small></p></li><li><p>We Luv Deez Hoez (featuring Backbone and Big Gipp)<small>Outkast</small></p></li><li><p>Humble Mumble (featuring Erykah Badu)<small>Outkast</small></p></li><li><p>Drinkin' Again (Interlude)<small>Outkast</small></p></li><li><p>?<small>Outkast</small></p></li><li><p>Red Velvet<small>Outkast</small></p></li><li><p>Cruisin' in the ATL (Interlude)<small>Outkast</small></p></li><li><p>Gangsta Shit (featuring Slimm Calhoun, Blackowned C-Bone and T-Mo)<small>Outkast</small></p></li><li><p>Toilet Tisha<small>Outkast</small></p></li><li><p>Slum Beautiful (featuring Cee Lo Green)<small>Outkast</small></p></li><li><p>Pre-Nump (Interlude)<small>Outkast</small></p></li><li><p>Stankonia (Stanklove) (featuring Big Rube and Sleepy Brown)<small>Outkast</small></p></li><li><p>Intro<small>Kanye West</small></p></li>  <li><p>We Don't Care<small>Kanye West</small></p></li><li><p>Graduation Day<small>Kanye West</small></p></li>  <li><p>All Falls Down (featuring Syleena Johnson)<small>Kanye West</small></p></li><li><p>I'll Fly Away<small>Kanye West</small></p></li>  <li><p>Spaceship (featuring GLC and Consequence)<small>Kanye West</small></p></li><li><p>Jesus Walks<small>Kanye West</small></p></li><li><p>Never Let Me Down (featuring Jay-Z and J. Ivy)<small>Kanye West</small></p></li><li><p>Get Em High (featuring Talib Kweli and Common)<small>Kanye West</small></p></li><li><p>Workout Plan<small>Kanye West</small></p></li><li><p>The New Workout Plan<small>Kanye West</small></p></li><li><p>Slow Jamz (featuring Twista and Jamie Foxx)<small>Kanye West</small></p></li><li><p>Breathe In Breathe Out (featuring Ludacris)<small>Kanye West</small></p></li><li><p>School Spirit (Skit 1)<small>Kanye West</small></p></li><li><p>School Spirit<small>Kanye West</small></p></li><li><p>School Spirit (Skit 2)<small>Kanye West</small></p></li><li><p>Lil Jimmy (Skit)<small>Kanye West</small></p></li><li><p>Two Words (featuring Mos Def, Freeway and the Boys Choir of Harlem)<small>Kanye West</small></p></li><li><p>Through the Wire<small>Kanye West</small></p></li><li><p>Family Business<small>Kanye West</small></p></li><li><p>Last Call<small>Kanye West</small></p></li><li><p>Hold On, Be Strong (featuring The Four Phonics)<small>Outkast</small></p></li><li><p>Return of the 'G'<small>Outkast</small></p></li><li><p>Rosa Parks<small>Outkast</small></p></li> <li><p>Skew It on the Bar-B (featuring Raekwon)<small>Outkast</small></p></li> <li><p>Aquemini<small>Outkast</small></p></li> <li><p>Synthesizer (featuring George Clinton)<small>Outkast</small></p></li> <li><p>Slump (featuring BackBone and Cool Breeze)<small>Outkast</small></p></li><li><p>West Savannah<small>Outkast</small></p></li> <li><p>Da Art of Storytellin' (Pt. 1)<small>Outkast</small></p></li> <li><p>Da Art of Storytellin' (Pt. 2)<small>Outkast</small></p></li><li><p>Mamacita (featuring Masada and Witchdoctor)<small>Outkast</small></p></li><li><p>SpottieOttieDopaliscious (featuring Pat Brown)<small>Outkast</small></p></li><li><p>Y\'All Scared (featuring T-Mo, Big Gipp and Khujo)<small>Outkast</small></p></li> <li><p>Nathaniel<small>Outkast</small></p></li><li><p>Liberation (featuring Cee-Lo, Erykah Badu and Big Rube)<small>Outkast</small></p></li> <li><p>Chonkyfire<small>Outkast</small></p></li>");
    displaying = "songs";
});
//***********************************************************************//
//***********************************************************************//


//click causes playing to skip to prev track
$("#backbutton").on("click", function(){
    targetindex = now_playing_index - 1;
    if (targetindex < 0){targetindex = 0;}
    console.log("backbutton clicked",targetindex, now_playing_index);
    playSound(targetindex);
});
//click causes playing song to be paused
$("#playbutton").on("click", function(){
    console.log("Play clicked");
    htmltext = $(this).html();
    if( htmltext == "<p> Pause </p>"){
        $(this).html("<p> Play </p>");
    }
    if(htmltext == "<p> Play </p>"){
        $(this).html("<p> Pause </p>");
    }
});
//click causes playing song to be paused
$("#pausebutton").on("click", function(){
    console.log("Pause clicked");
    $(this).removeAttr("id");
    $(this).attr("id","playbutton");
    $(this).html("<p> Play </p>");
});
$("#fwdbutton").on("click", function(){
    targetindex = now_playing_index + 1;
    console.log("Fwdbutton clicked",targetindex, now_playing_index);
    if (targetindex < queue.length){playSound(targetindex);}
});
