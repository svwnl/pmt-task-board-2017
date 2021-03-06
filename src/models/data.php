<?php

header('Content-Type: application/json');

// PMT Database credentials
include_once('../../../library/Config.php');
include_once(__DIR__ . '/functions.php');
$config = new config();

define('MODE_TASKS', 0);
define('MODE_BUGS', 1);
define('MODE_ALL', 2);
define('MODE_SPRINTS', 3);

try {
    $sprint = isset($_GET['sprint']) ? $_GET['sprint'] : null;
    $mode = isset($_GET['mode']) ? (int)$_GET['mode'] : 0;
    $previous = isset($_GET['previous']) && 1 == $_GET['previous'] ? true : false;

    $pdo = new PDO('mysql:dbname=' . $config->employeeDB . ';host=' . $config->host . ';charset=utf8',
        $config->employeeDBuser, $config->employeeDBpassword);

    if (in_array($mode, array(MODE_SPRINTS))) {

        // Do not merge sprints with tasks and bugs, different attributes
        $data = getSprints($pdo);
    } else {

        $tasks = array();
        $bugs = array();

        if (in_array($mode, array(MODE_TASKS, MODE_ALL))) {

            if (!empty($sprint)) {
                // Get open and closed tasks in requested sprint and, if previous is set, open tasks in previous sprints
                $tasks = $previous ? getTasksForSprintAndPrevious($pdo, $sprint) : getTasksForSprint($pdo, $sprint);
            } else {
                // Get all open tasks in all sprints
                $tasks = getTasks($pdo);
            }

        }

        if (in_array($mode, array(MODE_BUGS, MODE_ALL))) {
            $bugs = getBugs($pdo);
        }

        // lets make sure that we can also just get the bugs
        $data = array_merge($tasks, $bugs);
    }

    if (0 == count($data)) {
        $data = array(
            'error' => 'No data'
        );
    }

} catch (PDOException $e) {
    $data = array(
        'error' => 'Invalid database connection'
    );
}

echo json_encode($data, JSON_PRETTY_PRINT);