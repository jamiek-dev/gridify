<?php
	$mapName = $_REQUEST['mapName'];
	$str = file_get_contents("../map-data/{$mapName}.json");
	$json = json_encode($str, true);
	// echo '<pre>'.print_r($json, true).'</pre>';
	echo $json;
?>