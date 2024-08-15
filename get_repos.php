<?php
// get_repos.php

// Read the JSON file
$reposFile = 'repos.json';
if (file_exists($reposFile)) {
    $reposJson = file_get_contents($reposFile);
    $repos = json_decode($reposJson, true);

    // Set the content type to JSON
    header('Content-Type: application/json');

    // Output the JSON data
    echo json_encode($repos);
} else {
    // Handle the case where the JSON file does not exist
    http_response_code(404);
    echo json_encode(['error' => 'Repositories file not found.']);
}
?>
