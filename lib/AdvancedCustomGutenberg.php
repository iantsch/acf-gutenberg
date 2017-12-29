<?php

namespace MBT;

/**
 * Class AdvancedCustomGutenberg
 * @package MBT
 *
 * Plugin Core
 *
 * @author Christian Tschugg <christian@tschugg.net>
 */

class AdvancedCustomGutenberg extends AbstractSingleton {
    protected $prefix = 'acg';
    protected $fieldGroups = array();
    protected $layouts = array();
    protected $postTypes = array();
    protected $fields = array();

    function __construct()
    {
        $this->registerHooks();
    }

    protected function registerHooks()
    {
        add_action( 'init', array($this, 'registerAcfForGutenberg'));
        add_action( 'rest_api_init', array($this, 'registerApiEndpoints'));
        add_action( 'enqueue_block_assets', array($this, 'enqueueAcfLayouts'), 11 );
        add_action( 'acf/input/admin_head', array($this, 'removeAcfUi'), 99 );
        # TODO: Remove after proof of concept phase
        add_action( 'acf/gutenberg/render', array($this, 'debugRender'), 10 , 3 );
    }

    public function removeAcfUi() {
        do_action('acf/gutenberg/removeAcfUi');
    }

    public function registerAcfForGutenberg() {
        # Fetch ACF settings and populate Variables
        $this->fieldGroups = $this->getAcfFields();
        foreach ($this->fieldGroups as $fieldGroup) {
            $this->extractLayouts($this->layouts, $fieldGroup['fields']);
            $this->extractPostTypes($this->postTypes, $fieldGroup['location'], $fieldGroup['key']);
            $this->extractAcfFields($this->fields, $fieldGroup['fields']);
        }
        # Register Action Hook to add custom templates to front-end rendering of Gutenberg
        $this->registerAcfLayouts();

        # Adapt post type objects to register gutenberg blocks
        $this->registerAcfGroups();
    }

    protected function registerAcfLayouts() {
        foreach ($this->layouts as $layout => $groups) {
            register_block_type( $layout, array(
                'render_callback' => function($attributes, $content = null) use ($layout) {
                    ob_start();
                    do_action('acf/gutenberg/render', $attributes, $content, $layout);
                    $content = ob_get_clean();
                    return $content;
                },
            ) );
        }
    }

    public function enqueueAcfLayouts() {
        wp_enqueue_script(
            $this->prefix.'/lib',
            ACG_URL.'res/js/dist/AcfGutenberg.js',
            array(
                'wp-blocks',
                'wp-i18n',
                'wp-element'
            )
        );
        wp_add_inline_script( $this->prefix.'/lib', sprintf(
            'try{acg.register(%s)}catch(e){}',
            json_encode($this->fieldGroups)
        ) );
    }

    protected function registerAcfGroups() {
        foreach ($this->postTypes as $postType => $groups) {
            # Load Post Type object to adapt
            $postTypeObject = get_post_type_object($postType);

            # Add Field groups as custom gutenberg blocks
            $templates = array();
            foreach ($groups as $groupKey) {
                $sanitizedGroupKey = str_replace('_','-',$groupKey);
                $templates[] = array($this->prefix. '/' .$sanitizedGroupKey);

                # Remove existing normal ACF meta-boxes
                $fieldGroup = $this->fieldGroups[$groupKey];
                add_action('acf/gutenberg/removeAcfUi', function() use ($fieldGroup, $postType) {
                    #TODO: Make this prettier
                    if (!array_key_exists('classic-editor', $_GET)) {
                        remove_meta_box('acf-'.$fieldGroup['key'], $postType, $fieldGroup['position']);
                    }
                });

                # Register Timestamp (for Save-Button Hack)
                register_meta( $postType, "{$groupKey}_timestamp", array(
                    'show_in_rest' => true,
                    'single' => true,
                    'type' => 'timestamp',
                ) );
            }
            if (property_exists($postTypeObject, 'template') && !empty($postTypeObject->template)) {
                $templates = array_merge((array) $postTypeObject->template, $templates);
            }

            $postTypeObject->template = apply_filters('acf/gutenberg/templates', $templates, $postType);

            # Lock template, if group exists
            if (!empty($postTypeObject->template)) {
                $postTypeObject->template_lock = apply_filters('acf/gutenberg/lock', 'all', $postType);
            }

            # Add Gutenberg related support, if not already setup
            add_post_type_support($postType, array('editor','gutenberg'));

            # Add JSON API support (needed by Gutenberg)
            $postTypeObject->show_in_rest = true;
            if(!property_exists($postTypeObject, 'rest_base') || empty($postTypeObject->rest_base)) {
                $postTypeObject->rest_base = $postTypeObject->name;
            }
            if(!property_exists($postTypeObject, 'rest_controller_class') || empty($postTypeObject->rest_controller_class)) {
                $postTypeObject->rest_controller_class = 'WP_REST_Posts_Controller';
            }
        }
    }
    public function registerApiEndpoints() {
        register_rest_route( 'acf-gutenberg/v1', '/meta=(?P<id>\d+)', array(
            'methods' => \WP_REST_Server::READABLE,
            'callback' => array($this, 'getPostMeta'),
        ));
        register_rest_route( 'acf-gutenberg/v1', '/acf', array(
            'methods' => \WP_REST_Server::READABLE,
            'callback' => array($this, 'getAcfFields'),
        ));
        register_rest_route( 'acf-gutenberg/v1', '/group=(?P<key>[a-zA-Z0-9-_]+)&id=(?P<id>\d+)', array(
            'methods' => \WP_REST_Server::EDITABLE,
            'callback' => array($this, 'postAcfGroup'),
        ));
    }

    public function getPostMeta($data) {
        $postId = intval(trim($data['id']));
        $postMeta = get_post_meta($postId);
        if (is_array($postMeta)) {
            $postMeta = array_map(function($n) {return maybe_unserialize($n[0]);}, $postMeta);
        }
        return $postMeta;
    }

    public function getAcfFields() {
        $groups = acf_get_field_groups();
        $groups = array_column($groups, null, 'key');
        if (!empty($groups) && is_array($groups)) foreach ($groups as $key => &$group) {
            $group['fields'] = acf_get_fields($key);
        }
        return $groups;
    }

    public function postAcfGroup(\WP_REST_Request $request) {
        $fields = (array) $request->get_param('fields');
        $postId = $request->get_param('id');
        if ($postId < 1) {
            return array(
                'status' => 500,
                'message' => __('Post Id pending','acg')
            );
        }
        foreach ($fields as $fieldKey => $field) {
            @update_field($fieldKey, $field['value'], $postId);
        }
        return array(
            'status' => 200,
            'message' =>  __('OK','acg')
        );
    }

    protected function extractLayouts(&$return, $fields, $parentKey = '') {
        foreach ($fields as $field) {
            if (!isset($field['type'])) {
                $return[$this->prefix.'/'.$field['key']][] = $parentKey;
            }
            if (array_key_exists('sub_fields', $field)) {
                $this->extractLayouts($return, $field['sub_fields']);
            }
            if (array_key_exists('layouts', $field)) {
                $this->extractLayouts($return, $field['layouts'], $field['key']);
            }
        }
    }

    protected function extractPostTypes(&$return, $fields, $group) {
        foreach ($fields as $or) {
            foreach ($or as $and) {
                if (!isset($and['param'])) {
                    continue;
                }
                if (!isset($and['operator'])) {
                    continue;
                }
                if ($and['param'] !== 'post_type') {
                    continue;
                }
                if ($and['operator'] !== '==') {
                    continue;
                }
                $return[$and['value']][] = $group;
            }
        }
    }

    # TODO: Maybe obsolete?!?
    protected function extractAcfFields(&$return, &$fields, $parentKey = '') {
        foreach ($fields as &$field) {
            $key = $field['key'];
            if ('' !== $parentKey) {
                $key = $parentKey.'_'.$key;
            }
            if (!isset($field['type'])) {
                $field['type'] = 'layout';
            }
            $return[$key] = $field;
            $field['key'] = $key;
            if (array_key_exists('sub_fields', $field)) {
                $this->extractAcfFields($return, $field['sub_fields']);
                $return[$key]['sub_fields'] = array_map(function($field) {return $field['key'];}, $field['sub_fields']);
            }
            if (array_key_exists('layouts', $field)) {
                $this->extractAcfFields($return, $field['layouts'], $field['key']);
                $return[$key]['layouts'] = array_map(function($field) {return $field['key'];}, $field['layouts']);
            }
        }
    }

    # TODO: Remove after proof of concept phase
    public function debugRender($a, $b = null, $layout) {
        echo '<pre>';
        var_dump($layout);
        var_dump($a);
        var_dump($b);
        echo '</pre>';
    }
}
