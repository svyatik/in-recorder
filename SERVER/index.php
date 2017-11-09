<?php
    define('WEBSITE_URL', 'http://work.local/uploads/');

    $fn = (isset($_SERVER['HTTP_X_FILENAME']) ? $_SERVER['HTTP_X_FILENAME'] : false);
    $name = uniqid() . '.webm';

    if($fn) {
        file_put_contents(
            'uploads/' . $name,
            file_get_contents('php://input')
        );
        echo WEBSITE_URL . $name;
        exit();
    } else {
        echo 'error';
    }
?>
