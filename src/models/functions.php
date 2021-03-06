<?php

/**
 * Return open tasks in all sprints
 *
 * @param PDO $pdo
 * @return stdClass[]
 */
function getTasks(PDO $pdo)
{
    $stmt = $pdo->prepare('SELECT 
          t.counter as tasknumber,
          t.title as description, 
          t.status_id as status,
          t.dev_due_date,
          t.test_due_date,
          t.accp_release_date,
          t.product,
          (SELECT nickname FROM cms_employee_data AS e WHERE e.counter = t.assigned_by LIMIT 1) AS task_owner,
          m.project_id as projectId,
          GROUP_CONCAT(d.nickname) as workers,
          t.sprint
        FROM 
          `pmt_tasks` t
        INNER JOIN
          `pmt_modules` m
        ON 
          t.module_id = m.counter
        INNER JOIN
          (SELECT nickname, assignment_id FROM cms_employee_data c INNER JOIN pmt_assignment_details ad ON c.counter = ad.assigned_to WHERE ad.is_active = \'1\' AND ad.type = \'TASK\' ) d
        ON 
          d.assignment_id = t.counter
        WHERE t.status_id NOT IN (10) and t.is_active = \'1\' and t.sprint != ""
        GROUP BY t.counter
        ORDER BY t.counter;');

    if ($stmt->execute()) {
        return transformPDOResult($stmt, 'T');
    }
    return array();
}

/**
 * Return open and closed tasks in requested sprint
 *
 * @param PDO $pdo
 * @param string $sprint
 * @return stdClass[]
 */
function getTasksForSprint(PDO $pdo, $sprint)
{
    $stmt = $pdo->prepare('SELECT 
              t.counter as tasknumber,
              t.title as description, 
              t.status_id as status,
              t.dev_due_date,
              t.test_due_date,
              t.accp_release_date,
              t.product,
              (SELECT nickname FROM cms_employee_data AS e WHERE e.counter = t.assigned_by LIMIT 1) AS task_owner,
              m.project_id as projectId,
              GROUP_CONCAT(d.nickname) as workers,
              t.sprint
            FROM 
              `pmt_tasks` t
            INNER JOIN
              `pmt_modules` m
            ON 
              t.module_id = m.counter
            INNER JOIN
              (SELECT nickname, assignment_id FROM cms_employee_data c INNER JOIN pmt_assignment_details ad ON c.counter = ad.assigned_to WHERE ad.is_active = \'1\' AND ad.type = \'TASK\' ) d
            ON 
              d.assignment_id = t.counter
            WHERE t.sprint = :sprint and t.is_active = \'1\'
            GROUP BY t.counter
            ORDER BY t.counter;');
    $stmt->bindParam(':sprint', $sprint);
    
    if ($stmt->execute()) {
        return transformPDOResult($stmt, 'T');
    }
    return array();
}


/**
 * Return open and closed tasks in requested sprint and open tasks in previous sprints
 *
 * @param PDO $pdo
 * @param string $sprint
 * @return stdClass[]
 */
function getTasksForSprintAndPrevious(PDO $pdo, $sprint)
{
    $acceptance_release_date = getSprintAcceptanceReleaseDate($pdo, $sprint);

    $stmt = $pdo->prepare('SELECT 
          t.counter as tasknumber,
          t.title as description, 
          t.status_id as status,
          t.dev_due_date,
          t.test_due_date,
          t.accp_release_date,
          t.product,
          (SELECT nickname FROM cms_employee_data AS e WHERE e.counter = t.assigned_by LIMIT 1) AS task_owner,
          m.project_id as projectId,
          GROUP_CONCAT(d.nickname) as workers,
          t.sprint
        FROM 
          `pmt_tasks` t
        INNER JOIN
          `pmt_modules` m
        ON 
          t.module_id = m.counter
        INNER JOIN
          (SELECT nickname, assignment_id FROM cms_employee_data c INNER JOIN pmt_assignment_details ad ON c.counter = ad.assigned_to WHERE ad.is_active = \'1\' AND ad.type = \'TASK\' ) d
        ON 
          d.assignment_id = t.counter
        WHERE 
          (t.status_id NOT IN (10) and t.is_active = \'1\' and t.sprint != "" and t.accp_release_date < :acceptance_release_date)
          OR 
          (t.sprint = :sprint and t.is_active = \'1\')
        GROUP BY t.counter
        ORDER BY t.counter;');
    $stmt->bindParam(':acceptance_release_date', $acceptance_release_date);
    $stmt->bindParam(':sprint', $sprint);

    if ($stmt->execute()) {
        return transformPDOResult($stmt, 'T');
    }
    return array();
}

/**
 * @param PDO $pdo
 * @return stdClass[]
 */
function getBugs(PDO $pdo)
{
    $stmt = $pdo->prepare('SELECT 
          b.counter as tasknumber,
          b.title as description, 
          b.status_id as status,
          b.dev_due_date,
          b.test_due_date,
          b.accp_release_date,
          b.product,
         (SELECT nickname FROM cms_employee_data AS e WHERE e.counter = b.reported_by LIMIT 1) AS task_owner,
          m.project_id as projectId,
          GROUP_CONCAT(d.nickname) as workers,
          b.sprint
        FROM 
          `pmt_bug_reports` b
        INNER JOIN
          (SELECT nickname, assignment_id FROM cms_employee_data c INNER JOIN pmt_assignment_details ad ON c.counter = ad.assigned_to WHERE ad.is_active = \'1\' AND ad.type = \'BUG\' ) d
        ON 
          d.assignment_id = b.counter
        INNER JOIN
          `pmt_tasks` t 
        ON 
          t.counter = b.task_id
        INNER JOIN
          `pmt_modules` m 
        ON 
          m.counter = t.module_id
        WHERE b.status_id NOT IN (10) AND b.is_active = \'1\'
        GROUP BY b.counter
        ORDER BY b.counter;');

    if ($stmt->execute()) {
        return transformPDOResult($stmt, 'B');
    }
    return array();
}

/**
 * @param PDO $pdo
 * @return stdClass[]
 */
function getSprints(PDO $pdo)
{
    $stmt = $pdo->prepare('SELECT 
          sprint,
          UNIX_TIMESTAMP(acc_release_date) AS acceptance, 
          UNIX_TIMESTAMP(prod_release_date) AS production 
        FROM 
          `pmt_sprint`
  
        ORDER BY acc_release_date ASC;');

    if ($stmt->execute()) {
        return transformPDOResultSprints($stmt);
    }
    return array();
}

/**
 * Transforms the sprints data in the PDOStatement into an array format
 *
 * @param PDOStatement $stmt
 * @return array
 */
function transformPDOResultSprints(PDOStatement $stmt)
{
    $data = array();

    while (false !== ($row = $stmt->fetch(PDO::FETCH_ASSOC))) {
        $record = new stdClass;

        $record->sprint = $row['sprint'];
        $record->acceptance = $row['acceptance'];
        $record->production = $row['production'];

        $data[] = $record;
    }

    return $data;
}


/**
 * Return the acceptance release date of a sprint
 *
 * @param PDO $pdo
 * @param $sprint
 * @return string
 */
function getSprintAcceptanceReleaseDate(PDO $pdo, $sprint)
{
    $stmt = $pdo->prepare('SELECT 
          acc_release_date
        FROM 
          `pmt_sprint`
        WHERE sprint = :sprint
        LIMIT 1');
    $stmt->bindParam(':sprint', $sprint);

    if ($stmt->execute()) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row["acc_release_date"];
    }
    return array();
}

/**
 * Transforms the data in the PDOStatement into an array format
 *
 * @param PDOStatement $stmt
 * @param string $prefix What should the prefix be, a task or a bug
 * @return array
 */
function transformPDOResult(PDOStatement $stmt, $prefix)
{
    $data = array();

    while (false !== ($row = $stmt->fetch(PDO::FETCH_ASSOC))) {
        $record = new stdClass;

        $record->category = mapStatus($row['status']);
        $record->description = html_entity_decode($row['description'], ENT_COMPAT, 'UTF-8');
        $record->employee = explode(',', $row['workers']);
        $record->employee = array_map(function ($data) {
            return $data;
        }, $record->employee);
        sort($record->employee);
        $record->product = $row['product'];
        $record->project = $row['projectId'];
        $record->name = $row['tasknumber'];
        $record->sprint = $row['sprint'];
        $record->status = $row['status'];
        $record->task_owner = $row['task_owner'];
        $record->type = $prefix;
        $data[] = $record;
    }

    return $data;
}

/**
 * Transforms the PMT status to a TaskBoard status
 *
 * @param string $input
 * @return string
 */
function mapStatus($input)
{
    $categories = array(
        1 => 'backlog',
        2 => 'development',
        3 => 'development',
        4 => 'backlog',
        5 => 'test',
        6 => 'test',
        7 => 'ready for prod',
        8 => 'development',
        9 => 'production',
        10 => 'production',
        11 => 'backlog',
        12 => 'backlog',
        13 => 'ready for acc',
        15 => 'acceptance',
        16 => 'ready for prod',
        17 => 'deploy to test',
        18 => 'tester approved',
    );

    return isset($categories[$input])
        ? $categories[$input]
        : 'backlog';
}