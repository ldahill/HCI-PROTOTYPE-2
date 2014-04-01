<?php 
    ini_set('display_errors', 'On');
    error_reporting(E_ALL | E_STRICT);
    header('Content-Type: application/json');
    $genre = $_GET["genre"];
    $limit = $_GET["limit"];
    $offset = $_GET["offset"];
    $url = "https://api-v2.soundcloud.com/explore/".urlencode($genre)."?tag=uniform-time-decay-experiment%3A6%3A1392943040&limit=".$limit."&offset=".$offset."&linked_partitioning=1"; 
    echo json_encode(file_get_contents($url)); 

