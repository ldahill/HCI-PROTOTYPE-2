
var isstreaming = false;
var ispaused = false;
var now_playing_index = -1;
var displaying = "songs";
var queue = [];
var albums = [];
var artists = [];
var songs = [];
var playlists = [];
var songfiles= [];

var isSubset = false;
var subset = [];

var history = [];  //Array of tuples: {displaying string, object}
var dragstartindex = null;
var elemdragged = null;

function playSound(queueindex){
    if (now_playing_index != queueindex){
        if(isstreaming == true || ispaused == true){
            mySound.stop();
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
            whileplaying: function(){setprogress(this.position, this.duration)},
            autoplay: false
        });
        soundManager.play(mySound.id, {
            multiShotEvents: true,
            onfinish: function(){
                isstreaming = false;
                setprogress(0,1);
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
        setplaybutt("pause");
       // $("#playbutton").html("<img src=\"pausebutton.png\" id=\"pauseimg\">");      
    }
    else if(ispaused){
        mySound.play();
        isstreaming = true;
        ispaused = false;
        $('#list2 li').eq(now_playing_index).removeClass("paused").addClass("playing");
        setplaybutt("pause");
        //$("#playbutton").html("<img src=\"pausebutton.png\" id=\"pauseimg\">");    
    }
    else {
        mySound.pause();
        isstreaming = false;
        ispaused = true;
        $('#list2 li').eq(now_playing_index).removeClass("playing").addClass("paused");
        setplaybutt("play");
        //$("#playbutton").html("<img src=\"playbutton.png\" id=\"playimg\">");    
    }
}

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
    albums.sort(sortbytitle);
    songs.sort(sortbytitle);
}

function sortbytitle(a, b){
    var nameA=a.title.toLowerCase(), nameB=b.title.toLowerCase()
    if (nameA < nameB) 
        return -1 
    if (nameA > nameB)
        return 1
    return 0 //default return value (no sorting)
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

//  Takes filepaths and fileindex to create artist, album, and song arrays
//  Artist objects hold an array of indices for the album array
//  Album objects hold an array of indices for the song array
//  Song objects hold an index for the songfile array
function addtoContainers(fileindex, filepath){
    pathlist = filepath.split("/");
    name = pathlist[pathlist.length-1];
    album = pathlist[pathlist.length-2];
    artist = pathlist[pathlist.length-3];
    found = false;
    songname = cleansongname(name);
    var song = {title: songname, album: album, artist: artist, 
                fileindex:fileindex, isqd: false, source: null}; 
    songs.push(song);
    ///-----------------STOP HERE------------//
    for(var i = 0, len = albums.length; i < len; i++){
        alb = albums[i];
        if(album == alb.title){
            alb.songobjs.push(song);
            found = true;
        }
    }
    if(found == false){
        alb = {title: album, songobjs: [], artist: artist}; 
        alb.songobjs.push(song);
        albums.push(alb);
        for(var i = 0, len = artists.length; i < len; i++){
            art = artists[i];
            if(artist == art.title){
                art.albumobjs.push(alb);
                found = true;
            }
        }
        if(found == false){
            art = {title: artist, albumobjs: []}; 
            art.albumobjs.push(alb);
            artists.unshift(art);
        }
    }
}


/*
    /--------------------------------------------\
    |         DRAG AND DROP FUNCTIONALITY        |
    \--------------------------------------------/
*/

//arr.splice(2, 0, "Lene");

function enablesorting(listvar){
    if(listvar = "list2"){
        $('#list2').sortable({
            items: ':not(.disabled)'
        });
    }
    else if(listvar = "list1"){
        $('#list1').sortable({
            items: ':not(.disabled)'
        });
    }
}
function connectsorting(){
    $('#list1, #list2').sortable({
    connectWith: '.connected'
    });
}

$('.sortable').sortable().bind('dragstart', function(e) {
    console.log($(e.target).index());
    dragstartindex = $(e.target).index();
});

$('.sortable').sortable().bind('sortupdate', function(e, ui) {
    //ui.item contains the current dragged element.
    newindex = ui.item.index();
    arraymove(queue, dragstartindex, newindex);
    if(dragstartindex == now_playing_index){
        now_playing_index = newindex;
    }
    else if(dragstartindex > now_playing_index && newindex <= now_playing_index){
        now_playing_index += 1;
    }
    else if(dragstartindex < now_playing_index && newindex >= now_playing_index){
        now_playing_index -= 1;
    }
    //Triggered when the user stopped sorting and the DOM position has changed.
});

function arraymove(arr, fromIndex, toIndex){
    printit(arr);
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    printit(arr);
}

function printit(arr){
    for( var i = 0; i < arr.length; i++){
        console.log(arr[i].title);
    }
    console.log("---------------");
}


//Upon loading the document a mainlist and queue array are initialized.
//The mainlist is filled with artists to display by triggering an artists click
//soundManager is also initialized.
$(document).ready(function() {
    $(".bubble").hide();
    $("#addall").hide();
    //$("#addall").hide();
    $( "#slider" ).slider({ 
                            min: 0,
                            max: 100,
                            value: 50,
                            slide: function( event, ui ) {
                                   sliderchange(event, ui);
                            }
                         });
    mainlist = new Array();
    queue = new Array();
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
    $("#current-song").width($("#qheader").width());
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
            songobj.source = history[history.length - 1].obj;
            list2.append($(this).clone());
            enablesorting('list2');
            $(window).trigger('resize');
        } 
    }
    else{
        name = $(this).html();
        var list1 = $('#list1');
        if (displaying == "playlists"){
            list1.empty();
            console.log("isSubset ==" + isSubset);
            if(isSubset == false){
                playlistobj = playlists[elemindex];
            }
            else{
                playlistobj = playlists[elemindex];
            }
            selectedplaylist(playlistobj);
        }
        else if (displaying == "genres"){
            console.log("ERROR: SITE DOES NOT SUPPORT GENRE BROWSING YET");
        }
        else if (displaying == "artists"){
            console.log("in artists");
            artistobj = artists[elemindex];
            console.log("Selected artist: "+artistobj.title)
            selectedartist(artistobj);
        }
        else if (displaying == "albums"){
            list1.empty();
            console.log("isSubset ==" + isSubset);
            if(isSubset == false){
                albumobj = albums[elemindex];
            }
            else{
                albumobj = subset[elemindex];
            }
            selectedalbum(albumobj);
        }
    }
});

function selectedartist(artistobj){
    history.push({displaying: "artists", obj: artistobj});
    list1 = $("#list1");
    list1.empty();    
    albumarr = artistobj.albumobjs;
    isSubset = true;
    subset = [];
    for(i = 0, len = albumarr.length; i < len; i++){
        albumobj = albumarr[i];
        albumname = albumobj.title;
        list1.append("<li><p> "+albumname+" </p></li>");
        subset.push(albumobj);
    }
    displaying = "albums";
    
    $("#addall").hide(450);
    //HIDEADDALL
    // history.push({displaying: "artists", obj: artistobj});
}
function selectedalbum(albumobj){
    history.push({displaying: "albums", obj: albumobj});
    list1 = $("#list1");
    list1.empty();
    console.log("Selected Album: " + albumobj.title);
    songarr = albumobj.songobjs;
    console.log(songarr)
    subset = [];
    for(i = 0, len = songarr.length; i < len; i++){
        song = songarr[i];
        list1.append("<li draggable=true ondragstart=\"drag(event)\"><p>"+song.title+"<small> "+song.artist+"</small></p>");
        subset.push(song);
    }
    isSubset = true;
    displaying = "songs";
    $("#addall").show(450);
}
function selectedplaylist(playlistobj){
    history.push({displaying: "playlists", obj: playlistobj});
    list1 = $("#list1");
    list1.empty();
    console.log("Selected Playlist: " + playlistobj.title);
    songarr = playlistobj.songobjs;
    console.log(songarr)
    subset = [];
    for(i = 0, len = songarr.length; i < len; i++){
        song = songarr[i];
        list1.append("<li draggable=true ondragstart=\"drag(event)\"><p>"+song.title+"<small> "+song.artist+"</small></p>");
        subset.push(song);
    }
    isSubset = true;
    displaying = "songs";
    $("#addall").show(450);
    //SHOWHIDEALL
}

//Clicking on an element in the play queue will delete it 
$(document).on('click', '#list2 li', function(){
    playSound($(this).index());
});

$(document).on('mouseenter', '#list2 li', function(e){
    $(this).append("<img src=\"x-mark.jpg\" id=\"xmark\">");
    $("#xmark").click(function(){
        var qelem = $(this).parent();
        var j = qelem.index();
        queue[j].isqd = false;
        queue.splice(j, 1);
        qelem.remove();
        if(j == now_playing_index){
            isstreaming = false;
            ispaused = false;
            mySound.stop();
            now_playing_index = -1;
            setplaybutt("play");
        }
    });
});

$(document).on('mouseleave', '#list2 li', function(e){
    $(this).find("#xmark").remove();
});

//***********************************************************************\\
//***********************************************************************\\
//Below are the event listeners for the Browse Menu's side panel
//Each one will clear and update the Browse Menu's display
$("#playlists").on("click", function(){
    if(playlists.length >= 1){
        history.push({displaying: "playlists", obj: null});
        console.log("playlists clicked");
        $('#list1').empty();
        for(var i = 0, len = playlists.length; i < len; i++){
            listname = playlists[i].title;
            $('#list1').append("<li><p>" +listname+ " </p></li>");
        };
        displaying = "songs";

        isSubset = false;
        setdisplaybuttoncolor('#7e9fb9');
        $("#addall").hide(450);
    }
});
$("#artists").on("click", function(){
    history.push({displaying: "artists", obj: null});
    console.log("artists clicked");
    $('#list1').empty();
    for(var i = 0, len = artists.length; i < len; i++){
        artistname = artists[i].title;
        $('#list1').append("<li><p>" +artistname+ " </p></li>");
    };
    displaying = "artists";
    
    isSubset = false;
    setdisplaybuttoncolor('#7e9fb9');
    $("#addall").hide(450);
});
$("#genres").on("click", function(){
    console.log("genres clicked");

 /* $('#list1').empty();
    $('#list1').append();
    displaying = "genres";
    isSubset = false;*/
});
$("#albums").on("click", function(){
    history.push({displaying: "albums", obj: null});
    console.log("albums clicked");
    $('#list1').empty();
    for(var i = 0, len = albums.length; i < len; i++){
        albumname = albums[i].title;
        $('#list1').append("<li><p> "+albumname+" </p></li>");
    }
    displaying = "albums";
    
    isSubset = false;
    setdisplaybuttoncolor('#7e9fb9');
    $("#addall").hide(450);
});
$("#songs").on("click", function(){
    history.push({displaying: "songs", obj: null});
    console.log("songs clicked");
    $('#list1').empty();
    for(var i = 0, len = songs.length; i < len; i++){
        songname = songs[i].title;
        artist = songs[i].artist;
        $('#list1').append("<li draggable=true ondragstart=\"drag(event)\"><p>"+songname+"<small> "+artist+" </small></p>");
    }
    displaying = "songs";
    isSubset = false;
    setdisplaybuttoncolor('#7e9fb9');
    $("#addall").show(450);
});
//***********************************************************************//
//***********************************************************************//
$("#addall").on("click", function(){
   // var list1 = $("#list1 li").toArray();
    var list1 = $("#list1 li");
    var list2 = $("#list2");
    if(displaying == "songs"){
        if(isSubset == false){
            arr = songs;
        }
        else{
            arr = subset;
        }
        for(i = 0, len = arr.length; i < len; i++){
            songobj = arr[i]
            listelem  = list1.get(i);
            if(songobj.isqd == false){
                queue.push(songobj);
                songobj.isqd = true;
                songobj.source = history[history.length - 1].obj;
                list2.append($(listelem).clone());
            } 
        }
        enablesorting();
        $(window).trigger('resize');
    }
});


$("#sourcebuttn").on("click", function(){
    sourceobj = queue[now_playing_index].source;
    if(sourceobj == null){
        $("#songs").trigger("click");
    }
    else if(sourceobj.hasOwnProperty("artist")){
        selectedalbum(sourceobj);
    }
    else{
        selectedplaylist(sourceobj);
    }
    console.log(sourceobj);
});

$("#makeplaylist").on("click", function(e){
    posx = $(this).position().left + $(this).width()/2;
    posy = $(this).position().top + $(this).height();
    newx = posx - 202.5;
    newy = posy + 19;
    console.log("Y: " + posy +" X: " + posx);
    if(queue.length > 0){
        $(".bubble").css({
            "position":"absolute", 
            "top": newy + "px",
            "left": newx + "px",
        });
        console.log("New Y: " + newy +" New X: " + newx);
        $(".bubble").show();
    }
    //var listnum = playlists.length + 1;
});
$("#pnameform").bind("keypress", {}, function(e){
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) { //Enter keycode                       
        e.preventDefault();
        getplaylist();
        $(".bubble").hide();
    }
});
$("#listnamebutton").on("click", function(){
    //var listnum = playlists.length + 1;
    getplaylist();
    $(".bubble").hide();
});
$("#cancelname").on("click", function(){
    $(".bubble").hide();
})

function getplaylist(){
    var listname = $("#listname").val();
    if (listname != "")
    {
        playlistobj = {title: listname, songobjs: []};
        for(var i = 0; i < queue.length; i++){
            songobj = queue[i];
            playlistobj.songobjs.push(songobj);
        }
        playlists.push(playlistobj);
    }
}

$("#clearall").on("click", function(){
    $("#list2").empty();
    setplaybutt("play");
    for(var i = 0; i < queue.length; i++){
        queue[i].isqd = false;
    }
    queue = [];
    if(now_playing_index != -1){
        mySound.stop();

    }
})

function setdisplaybuttoncolor(color){
    $("#artists").css('background-color','#FFFFFF');
    $("#albums").css('background-color','#FFFFFF');
    $("#playlists").css('background-color','#FFFFFF');
    $("#songs").css('background-color','#FFFFFF');
    buttonid = '#' + displaying;
    $(buttonid).css('background-color',color);
}

$("#brwseback").on("click",function(){
    console.log("back button pushed");
    if(history.length >= 2){
        history.pop();
        hist = history.pop();
        console.log("Return to: ");
        console.log(hist);
        displaying = hist.displaying;
        obj = hist.obj;
        if(obj == null){
            container = "#" + displaying;
            $(container).trigger("click");
        }
        else{
            if(displaying = "artists"){
                selectedartist(obj);
                
            }
            else if(displaying = "albums"){
                selectedalbum(obj);
                
            }
            else if(displaying = "playlists"){
                selectedplaylist(obj);
                
            }
        }
    }
});
//click causes playing to skip to prev track
$("#backbutton").on("click", function(){
    if(now_playing_index != -1){
        currpos = mySound.position/1000
        if(currpos <= 3){
            targetindex = now_playing_index - 1;
            if (targetindex < 0){targetindex = 0;}
            playSound(targetindex);
        }
        else{
            mySound.stop();
            mySound.start();
        }
    }
});
//click causes playing song to be paused
$("#playbutton").on("click", function(){
    htmltext = $(this).html();
    if(queue.length > 0){
        if(htmltext == "<img src=\"pausebutton.png\" id=\"pauseimg\">"){
            playSound(now_playing_index);
            //$(this).html("<img src=\"playbutton.png\" id=\"playimg\">");
            setplaybutt("play");
        }
        else if(htmltext == "<img src=\"playbutton.png\" id=\"playimg\">"){
            if(now_playing_index == -1){
                playSound(0);
            }
            else{
                playSound(now_playing_index);
            }
            setplaybutt("pause");
           // $(this).html("<img src=\"pausebutton.png\" id=\"pauseimg\">");
        }
    }
});

$("#fwdbutton").on("click", function(){
    targetindex = now_playing_index + 1;
    if (targetindex < queue.length){playSound(targetindex);}
});

function setplaybutt(a){
    if(a != "play" && a != "pause"){
        console.log("INVALID STRING")
        return;
    }
    htmltext = "<img src=\""+a+"button.png\" id=\""+a+"img\">"
    $("#playbutton").html(htmltext);
}
//$("#playbutton").html("<img src=\"playbutton.png\" id=\"playimg\">");


function addprogbar(listindex){
    setprogress(0, 100);
  /*  selector = "#list2 li:nth-child(" + listindex + ")"; 
    $("#progressbar").remove();
    $(selector).append("<div id = \"progressbar\"></div>");
    console.log(selector);
    console.log($(selector).text());
    $("#list2 li").eq(listindex).prepend("<span id = \"progressbar\"></span>");
    */
}

function setprogress(currpos, length){
    progwidth = currpos/length;
    $("#progressbar").css('width', (progwidth * 100) + "%");
}

function sliderchange(event, ui){
    if(typeof mySound === 'undefined'){}
    else{
        volval = ui.value;
        soundManager.setVolume(mySound.id,volval);
    }
}



function drag(ev)
{
    elemdragged = ev.target;
    if(ev.target.parentNode.id != "list1"){
        elemdragged = null;
    }
}
function allowDrop(ev)
{
    if(elemdragged != null){
        elemindex = $(elemdragged).index();
        if(isSubset == false){
            songobj = songs[elemindex];
        }
        else{
            songobj = subset[elemindex];
        }
        if(songobj.isqd == false){
            ev.preventDefault();
        }
    }
}

function drop(ev)
{
    ev.preventDefault();
    if(elemdragged != null){
        $(elemdragged).trigger("click");
    }
}

















