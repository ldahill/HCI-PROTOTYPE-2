
var isstreaming = false;
var ispaused = false;
var now_playing_index = -1;
var displaying = "songs";
var queue = [];
var albums = [];
var artists = [];
var songs = [];
var songfiles= [];

var isSubset = false;
var subset = [];

var history = [];  //SHOULD BE AN ARRAY OF TUPLES (displaying string, and # selected)


function playSound(queueindex){
    if (now_playing_index != queueindex){
        if(isstreaming == true || ispaused == true){
            mySound.pause();
            isstreaming = false;
            ispaused = false;
            $('#list2 li').eq(now_playing_index).removeClass("playing");
            $('#list2 li').eq(now_playing_index).removeClass("paused");
        }
        file = songfiles[queue[queueindex].fileindex];
        console.log(songfiles);
        var objectURL = window.URL.createObjectURL(file);
        mySound = soundManager.createSound({
            id: 'track_' + file.name,
            url: objectURL,
            autoplay: false
        });
        soundManager.play(mySound.id, {
            multiShotEvents: true,
            onfinish: function(){
                isstreaming = false;
                $('#list2 li').eq(now_playing_index).removeClass("playing");
                $('#list2 li').eq(now_playing_index).removeClass("paused");
                if(queueindex < queue.length){
                    playSound(queueindex + 1)
                }
            }
        });
        now_playing_index = queueindex;
        isstreaming = true;
        ispaused = false;
        $('#list2 li').eq(queueindex).removeClass("paused").addClass("playing"); 
        $("#playbutton").html("<img src=\"pausebutton.png\" id=\"pauseimg\">");      
    }
    else if(ispaused){
        mySound.play();
        isstreaming = true;
        ispaused = false;
        $('#list2 li').eq(now_playing_index).removeClass("paused").addClass("playing");
        $("#playbutton").html("<img src=\"pausebutton.png\" id=\"pauseimg\">");    
    }
    else {
        mySound.pause();
        isstreaming = false;
        ispaused = true;
        $('#list2 li').eq(now_playing_index).removeClass("playing").addClass("paused");
        $("#playbutton").html("<img src=\"playbutton.png\" id=\"playimg\">");    
    }
}

//--------------------------------------------------------------------||
//Below are the event listeners that control folder uploading
/*$("#fileURL").change(function(){

});*/

$('input[type=file]').change(function(e){
    $('#cover').remove();
    $('#intro').remove();
    files = e.target.files;
    organizeFiles(files);
    $("#artists").trigger('click');
});

function organizeFiles(files){
    for (var i = 0, len = files.length; i < len; i++) {
        file = files[i];
        extension = file.name.split(".").pop();
        if(extension != "" && extension != "DS_Store"){
            songfiles[i] = file;
            addtoContainers(i, file.webkitRelativePath);
        }
    }
}

function cleansongname(name){
    namearray = name.split(".");
    namearray.pop();
    songtitle = namearray.join(".");
    namearray = songtitle.split(" ");
    if(!isNaN(namearray[0])){
        namearray.shift();
    }
    if(namearray[0] == '-'){
         namearray.shift();
    }
    return namearray.join(" ");
}
function addtoContainers(fileindex, filepath){
    pathlist = filepath.split("/");
    name = pathlist[pathlist.length-1];
    album = pathlist[pathlist.length-2];
    artist = pathlist[pathlist.length-3];
    found = false;
    songname = cleansongname(name);
    song = {title: songname,album: album, artist: artist,fileindex:fileindex,
           isqd: false}; 
    songs.push(song);
    songindex = songs.length - 1;

    for(var i = 0, len = albums.length; i < len; i++){
        alb = albums[i];
        if(album == alb.title){
            alb.songindices.push(songindex);
            found = true;
        }
    }
    if(found == false){
        alb = {title: album, songindices: [], artist: artist}; 
        alb.songindices.push(songindex);
        albums.push(alb);
        for(var i = 0, len = artists.length; i < len; i++){
            art = artists[i];
            if(artist == art.title){
                art.albumindices.push(albums.length - 1);
                found = true;
            }
        }
        if(found == false){
            art = {title: artist, albumindices: []}; 
            art.albumindices.push(albums.length - 1);
            artists.unshift(art);
        }
    }
}


//--------------------------------------------------------------------||


//Upon loading the document a mainlist and queue array are initialized.
//The mainlist is filled with artists to display by triggering an artists click
//soundManager is also initialized.
$(document).ready(function() {
    mainlist = new Array();
    queue = new Array();
   // $("#artists").trigger('click');
    $("#playlists").trigger('click');
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
    var col1 = $('#Col1');
    var col2 = $('#Col2');
    var colsep = $('#colsep');
    if (col1.height() < col2.height()){
        col1.height(col2.height());
    }
    else {
        col2.height(col1.height());
    }
   // colsep.offset(col2.offset());
}).resize();

//Relies on the order of list 1 corresponding to the order of
//mainlist
$(document).on('click', '#list1 li', function(){
    var list2 = $('#list2');
    var elemindex = $(this).index();
    console.log("Browse element clicked");
    if (displaying == "songs"){
        if(isSubset == false){
            songobj = songs[elemindex];
        }
        else{
            songobj = subset[elemindex];
        }
        console.log(songobj);
        if(songobj.isqd == false){
            queue.push(songobj);
            songobj.isqd = true;
            list2.append($(this).clone());
            $(window).trigger('resize');
        } 
    }
    else{
        name = $(this).html();
        var list1 = $('#list1');
        if (displaying == "playlists"){
            console.log("ERROR: SITE DOES NOT SUPPORT PLAYLIST BROWSING YET");
        }
        else if (displaying == "genres"){
            console.log("ERROR: SITE DOES NOT SUPPORT GENRE BROWSING YET");
        }
        else if (displaying == "artists"){
            console.log("in artists");
            artistobj = artists[elemindex];
            console.log("Selected artist: "+artistobj.title)
            albumarr = artistobj.albumindices;
            list1.empty();
            history.push({displaying: "artists", 
                          listelem: $(this), subset: subset});
            isSubset = true;
            subset = [];
            for(i = 0, len = albumarr.length; i < len; i++){
                albumobj = albums[albumarr[i]];
                albumname = albumobj.title;
                list1.append("<li><p> "+albumname+" </p></li>");
                subset.push(albumobj);
            }
            displaying = "albums";
        }
        else if (displaying == "albums"){
            list1.empty();
            console.log("isSubset ==" + isSubset);
            if(isSubset == false){
                history.push({displaying: "albums", listelem: $(this), subset: []});
                albumobj = albums[elemindex];
            }
            else{
                history.push({displaying: "albums", listelem: $(this), subset: subset});
                albumobj = subset[elemindex];
            }
            console.log("Selected Album: " + albumobj.title);
            songarr = albumobj.songindices;
            console.log(songarr)
            subset = [];
            for(i = 0, len = songarr.length; i < len; i++){
                song = songs[songarr[i]];
                list1.append("<li><p>"+song.title+"<small> "+song.artist+"</small></p>");
                subset.push(song);
            }
            isSubset = true;
            displaying = "songs";
        }
    }
});

//Clicking on an element in the play queue will delete it 
$(document).on('click', '#list2 li', function(){
    //$(this).remove();
    playSound($(this).index());
});

//***********************************************************************\\
//***********************************************************************\\
//Below are the event listeners for the Browse Menu's side panel
//Each one will clear and update the Browse Menu's display
$("#playlists").on("click", function(){
    console.log("playlists clicked");
 /* $('#list1').empty();
    $('#list1').append();
    displaying = "playlists";
    isSubset = false;*/
});
$("#artists").on("click", function(){
    history.push({displaying: "artists", listelem: $(this), subset: []});
    console.log("artists clicked");
    $('#list1').empty();
    for(var i = 0, len = artists.length; i < len; i++){
        artistname = artists[i].title;
        $('#list1').append("<li><p>" +artistname+ " </p></li>");
    };
    displaying = "artists";
    isSubset = false;
    setdisplaybuttoncolor('#7e9fb9');
});
$("#genres").on("click", function(){
    console.log("genres clicked");
 /* $('#list1').empty();
    $('#list1').append();
    displaying = "genres";
    isSubset = false;*/
});
$("#albums").on("click", function(){
    history.push({displaying: "artists", listelem: $(this), subset: []});
    console.log("albums clicked");
    $('#list1').empty();
    for(var i = 0, len = albums.length; i < len; i++){
        albumname = albums[i].title;
        $('#list1').append("<li><p> "+albumname+" </p></li>");
    }
    setdisplaybuttoncolor();
    displaying = "albums";
    isSubset = false;
    setdisplaybuttoncolor('#7e9fb9');
});
$("#songs").on("click", function(){
    history.push({displaying: "artists", listelem: $(this), subset: []});
    console.log("songs clicked");
    $('#list1').empty();
    for(var i = 0, len = songs.length; i < len; i++){
        songname = songs[i].title;
        artist = songs[i].artist;
        $('#list1').append("<li><p>"+songname+"<small> "+artist+" </small></p>");
    }
    setdisplaybuttoncolor('#FFFFFF');
    displaying = "songs";
    isSubset = false;
    setdisplaybuttoncolor('#7e9fb9');
});
//***********************************************************************//
//***********************************************************************//
$("#brwseback").on("click",function(){
    if(history.length >= 2){
        console.log(history.pop());
        hist = history.pop();
        console.log(hist);
        displaying = hist.displaying;
        subset = hist.subset;
        isSubset = true;
        if(subset == []){
            isSubset = false;
        }
        console.log("FUCK YEA");
        hist.listelem.trigger("click");
    }   
  //  {displaying: "artist", listelem: $(this), subset: []}
});

function setdisplaybuttoncolor(color){
    $("#artists").css('background-color','#FFFFFF');
    $("#albums").css('background-color','#FFFFFF');
    $("#songs").css('background-color','#FFFFFF');
    buttonid = '#' + displaying;
    $(buttonid).css('background-color',color);
}

//click causes playing to skip to prev track
$("#backbutton").on("click", function(){
    targetindex = now_playing_index - 1;
    if (targetindex < 0){targetindex = 0;}
    playSound(targetindex);
});
//click causes playing song to be paused
$("#playbutton").on("click", function(){
    console.log("Play clicked");
    htmltext = $(this).html();
    console.log(htmltext);
    if(queue.length > 0){
        if(htmltext == "<img src=\"pausebutton.png\" id=\"pauseimg\">"){
            playSound(now_playing_index);
            $(this).html("<img src=\"playbutton.png\" id=\"playimg\">");
        }
        else if(htmltext == "<img src=\"playbutton.png\" id=\"playimg\">"){
            if(now_playing_index == -1){
                playSound(0);
            }
            else{
                playSound(now_playing_index);
            }
            $(this).html("<img src=\"pausebutton.png\" id=\"pauseimg\">");
        }
    }
});

$("#fwdbutton").on("click", function(){
    targetindex = now_playing_index + 1;
    if (targetindex < queue.length){playSound(targetindex);}
});
