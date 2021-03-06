<?php
header('Content-Type: application/json');

function generateMenu($title, $url, $limit, $depth = 5) {
    $menu = array();

    for ($i = 0; $i <= $limit; $i++) {
        if ($title !== null) {
            $newTitle = $title . ' > ' . $i;
        } else {
            $newTitle = $i;
        }

        $newUrl = $url . '/' . $i;
        $children = array();

        if ($depth && $i != 5) {
            $depth--;
            $children = generateMenu($newTitle, $newUrl, rand(0, 15), $depth);
        }

        $menu[] = array(
            'title' => $newTitle,
            'url' => $newUrl,
            'children' => $children
        );
    }

    return $menu;
};

echo json_encode(array(
    'title' => 'Root',
    'url' => '/',
    'children' => generateMenu(null, '', 5)
));