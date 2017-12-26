<?php
/*
Plugin Name: Advanced Custom Gutenberg
Plugin URI: http://mbt.wien
Description: Render Advanced Custom Field Groups in Gutenberg Editor.
Version: 0.0.0
Author: Christian Tschugg
Author URI: http://mbt.wien
Copyright: Christian Tschugg
Text Domain: acg
Domain Path: /lang
*/

if( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

define('ACG_DIR', plugin_dir_path( __FILE__ ));
define('ACG_URL', plugin_dir_url( __FILE__ ));

if (!class_exists('Psr4Autoloader')) {
    include ACG_DIR . '/Psr4Autoloader.php';
}

$psr4Autoloader = new Psr4Autoloader;
$psr4Autoloader->register();
$psr4Autoloader->addNamespace('MBT', ACG_DIR . '/lib');

add_action('acf/init', array('\\MBT\\AdvancedCustomGutenberg','init'));
