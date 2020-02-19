<?php
	$mapName = $_REQUEST['mapName'];
	$id = $_REQUEST['id'];
	$notes = $_REQUEST['notes'];
	$file = "../map-data/{$mapName}.json";
	if(file_exists($file)) {
		$array = json_decode(file_get_contents("../map-data/{$mapName}.json"), true);
		
		// There's no need to check if the id is already in the array
		// because we'll jsut override the notes if it is
		$array[$id] = $notes;

		file_put_contents($file, json_encode($array));
	} else {
		$array = array($id => $notes);
		file_put_contents("../map-data/{$mapName}.json", json_encode($array));
	}
?>