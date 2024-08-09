<?php
// add_repo.php


// Get the raw POST data

$postData = file_get_contents('php://input');
$newRepo = json_decode($postData, true);


if ($newRepo) {
    // Read the current repositories
    $reposFile = 'repos.json';
    if (file_exists($reposFile)) {
        $reposJson = file_get_contents($reposFile);
        $repos = json_decode($reposJson, true);
    } else {
        $repos = [];
    }
    

    // Add the new repository
    $repos[] = $newRepo;

    // Save the updated repositories back to the JSON file
    if (file_put_contents($reposFile, json_encode($repos))) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to save repository']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
}
?>
