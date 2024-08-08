<?php
// login_process.php
$servername = "localhost";
$username = "root"; // Your MySQL username
$password = ""; // Your MySQL password
$dbname = "myapp";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $_POST['username'];
    $pass = $_POST['password'];

    // Prepare and bind
    $stmt = $conn->prepare("SELECT hashed_password FROM users WHERE username = ?");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $stmt->bind_result($hashed_password);
    $stmt->fetch();

    // Verify the password
    if (password_verify($pass, $hashed_password)) {
        echo "Login successful!";
    } else {
        echo "Invalid username or password.";
    }

    $stmt->close();
}

$conn->close();
?>
