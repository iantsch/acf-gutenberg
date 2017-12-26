<?php

namespace MBT;

/**
* Class AbstractSingleton
* @package MBT
*
* Abstract Singleton Class.
*
* @author Christian Tschugg <christian@tschugg.net>
*/

abstract class AbstractSingleton {

    private static $instances = array();

    static public function init() {
        $class = get_called_class();
        if (!isset(self::$instances[$class])) {
            self::$instances[$class] = new static();
        }
        return self::$instances[$class];
    }
}
