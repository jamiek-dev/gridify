<?php
	$mapName = $_REQUEST['mapName'];
	$id = $_REQUEST['id'];
	$file = "../map-data/{$mapName}.json";
	if(file_exists($file)) {
		$array = json_decode(file_get_contents("../map-data/{$mapName}.json"), true);
		
		// There's no need to check if the id is already in the array
		// because we'll jsut override the notes if it is
		unset($array[$id]);

		file_put_contents($file, json_encode($array));
	}
?>