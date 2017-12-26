# acf-gutenberg
An Gutenberg wrapper for ACF functionality

## Proof of concept for post meta (most common use)
- Registers all built-in ACF fields as post_meta for the JSON-API to call. (SQL, JSON and PHP registered fields)
  Don't know how to register wildcard post meta fields for the API yet.
- Create React Components for all built-in ACF fields (Yep this has to happen) Maybe start with one simple (textfield) and a complex one (relational)
- Register ACF Components with a single JS file (unitl HTTP 2) 
- Create Hooks for custom acf fields to register their ACF wrappers.

## What has happend so far?
- Registering registered ~~ACF layout blocks as Gutenberg Blocks with pseudo markup.~~ ACF Field groups as Gutenberg Templates.
- Registering Post Meta Fields (non repeatable)
- Register more than one Gutenberg Block with a single compiled JS file.

## You have thoughts to share, want to collaborate?
Feel free to get in contact: create an issue here or write an email to iantsch@gmail.com or tweet @iantsch.
