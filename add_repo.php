<?php
// add_repo.php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $newRepo = [
        "id" => time(), // Simple way to generate a unique ID
        "name" => $_POST['name'],
        "description" => $_POST['description'],
        "owner" => $_POST['owner'],
        "created_at" => date("Y-m-d")
    ];

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
    file_put_contents($reposFile, json_encode($repos));

    // Redirect to a confirmation page or back to the form
    header('Location: success.html');
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Invalid request method.']);
}
?>
