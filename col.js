
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


function playSound(queueindex){
    console.log(queueindex);
    if (now_playing_index != queueindex){
        if(isstreaming == true || ispaused == true){
            mySound.pause();
            isstreaming = false;
            ispaused = false;
            $('#list2 li').eq(now_playing_index).removeClass("playing");
            $('#list2 li').eq(now_playing_index).removeClass("paused");
        }
       // console.log(queueindex, queue())
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
                now_playing_index = -1;
                if(queueindex < queue.length){
                    playSound(queueindex + 1)
                }
            }
        });
        now_playing_index = queueindex;
        isstreaming = true;
        ispaused = false;
        $('#list2 li').eq(queueindex).removeClass("paused").addClass("playing"); 
        $("#playbutton").html("<p>Pause</p>");      
    }
    else if(ispaused){
        mySound.play();
        isstreaming = true;
        ispaused = false;
        $('#list2 li').eq(now_playing_index).removeClass("paused").addClass("playing");
        $("#playbutton").html("<p>Pause</p>");    
    }
    else {
        mySound.pause();
        isstreaming = false;
        ispaused = true;
        $('#list2 li').eq(now_playing_index).removeClass("playing").addClass("paused");
        $("#playbutton").html("<p>Play</p>");    
    }
}

//--------------------------------------------------------------------||
//Below are the event listeners that control folder uploading
/*$("#fileURL").change(function(){

});*/

$('input[type=file]').change(function(e){
    files = e.target.files;
    organizeFiles(files);
    file = files[40];
    var objectURL = window.URL.createObjectURL(file);
    console.log('created object url: %o', objectURL);
    mySound = soundManager.createSound({
            id: 'track_'+files[40].name,
            url: objectURL,
            autoplay: false
    });
    $("#artists").trigger('click');
   /* soundManager.play(mySound.id, {
            multiShotEvents: true
    }); */
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
    console.log(artists);
    console.log(albums);
}

function addtoContainers(fileindex, filepath){
    pathlist = filepath.split("/");
    name = pathlist[pathlist.length-1];
    album = pathlist[pathlist.length-2];
    artist = pathlist[pathlist.length-3];
    found = false;

    almosttitle = name.split(".")[0];
    song = {title: almosttitle.slice(3, almosttitle.length),album: album,
            artist: artist,fileindex:fileindex, isqd: false}; 
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
        alb = new Object();
        alb.title = album;
        alb.songindices = [];
        alb.songindices.push(songindex);
        alb.artist = artist;
        albums.push(alb);
        for(var i = 0, len = artists.length; i < len; i++){
            art = artists[i];
            if(artist == art.title){
                art.albumindices.push(albums.length - 1);
                found = true;
            }
        }
        if(found == false){
            art = new Object();
            art.title = artist;
            art.albumindices = [];
            art.albumindices.push(albums.length - 1);
            artists.push(art);
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
    var elemindex = $(this).index();    
    console.log("Browse Element Clicked");
    console.log(displaying);
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
            artistobj = artists[elemindex];
            console.log("Selected artist: "+artistobj.title)
            albumarr = artistobj.albumindices;
            list1.empty();
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
                albumobj = albums[elemindex];
            }
            else{
                albumobj = subset[elemindex];
                console.log(albumobj);
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
    $('#list1').empty();
    $('#list1').append("<li><p> Chilling </p></li><li><p> Dingus Status Swag </p></li><li><p> Happy </p></li><li><p> Running </p></li><li><p> Party </p></li>");
    displaying = "playlists";
    isSubset = false;
});
$("#artists").on("click", function(){
    console.log("artists clicked");
    $('#list1').empty();
    for(var i = 0, len = artists.length; i < len; i++){
        artistname = artists[i].title;
        $('#list1').append("<li><p>" +artistname+ " </p></li>");
    }
    displaying = "artists";
    isSubset = false;
});
$("#genres").on("click", function(){
    console.log("genres clicked");
    $('#list1').empty();
    $('#list1').append("<li><p> Ambient </p></li><li><p> Classical </p></li><li><p> Country </p></li><li><p> Dance </p></li><li><p> Electronic </p></li><li><p> Southern Slang </p></li><li><p> R & B </p></li><li><p> Rock & Roll </p></li><li><p> World Music </p></li>");
    displaying = "genres";
    isSubset = false;
});
$("#albums").on("click", function(){
    console.log("albums clicked");
    $('#list1').empty();
    for(var i = 0, len = albums.length; i < len; i++){
        albumname = albums[i].title;
        $('#list1').append("<li><p> "+albumname+" </p></li>");
    }
    displaying = "albums";
    isSubset = false;
});
$("#songs").on("click", function(){
    console.log("songs clicked");
    $('#list1').empty();
    for(var i = 0, len = songs.length; i < len; i++){
        songname = songs[i].title;
        artist = songs[i].artist;
        $('#list1').append("<li><p>"+songname+"<small> "+artist+" </small></p>");
    }
    displaying = "songs";
    isSubset = false;
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
    console.log(htmltext);
    if( htmltext == "<p>Pause</p>"){
        $(this).html("<p>Play</p>");
    }
    if(htmltext == "<p>Play</p>"){
        $(this).html("<p>Pause</p>");
    }
});

$("#fwdbutton").on("click", function(){
    targetindex = now_playing_index + 1;
    console.log("Fwdbutton clicked",targetindex, now_playing_index);
    if (targetindex < queue.length){playSound(targetindex);}
});
