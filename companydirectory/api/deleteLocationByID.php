<?php

// example use from browser
// use insertDepartment.php first to create new dummy record and then specify its id in the command below
// http://localhost/companydirectory/libs/php/deleteDepartmentByID.php?id=<id>

// remove next two lines for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

// Create a connection to the database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check for a connection error and return an error response if it occurs
if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

// Prepare a SQL statement to check if the department has associated personnel
$query = $conn->prepare('SELECT  d.id, d.name, d.locationID  
          FROM department d 
          LEFT JOIN location l ON l.id = d.locationID 
          WHERE l.id = ?');
$query->bind_param("i", $_REQUEST['id']);
$query->execute();

$result = $query->get_result();

if ($result->num_rows > 0) {
    // If there are personnel in the department, return an error response
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Location can't be deleted because some department are in the location.";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);
    echo json_encode($output);
    exit;
} else {
    // Prepare a SQL statement to delete the location if no personnel are associated with it
    $query = $conn->prepare('DELETE FROM location WHERE id = ?');
    $query->bind_param("i", $_REQUEST['id']);
    $query->execute();

    if ($query === false) {
        // If the query fails, return an error response
        $output['status']['code'] = "400";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "query failed";	
        $output['data'] = [];

        mysqli_close($conn);
        echo json_encode($output); 
        exit;
    }

    // If the deletion is successful, return a success response
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    
    mysqli_close($conn);
    echo json_encode($output); 
}

?>
