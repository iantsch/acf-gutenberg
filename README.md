# acf-gutenberg
An Gutenberg wrapper for ACF Fieldgroups. It handles all necessary post type changes if the current post type does not meet the Gutenberg requirements (API support, Gutenberg flags).

Tested with
- Wordpress 4.9.1
- Gutenberg 1.9.1
- ACF Pro 5.6.7

## Proof of concept
- Register custom JSON API routes for acf-gutenberg, for data handling.
- Create React Components for all built-in ACF fields (Yep, I know...) Maybe start with one simple (textfield) and a complex one (relational)
- Register ACF Components with a single JS file (unitl HTTP 2) 
- Create Hooks for custom acf fields to register their ACF Components. (This is some wierd JS modules stuff, I do not know yet how to handle)

## What has happend so far?
- Register a timestamp post meta field for each ACF field group to enable update button on changes.
- Register more than one gutenberg block with a single compiled JS file. Since there are no nested gutenberg blocks (yet), work around this issue.
- Basic fields (Text, E-Mail,…)
- Relationship field (Yay a complex react component with custom JSON API)

## What is currently missing [Priority]
- Any forms of validation. [LOW]
- Content fields [MID] _Copy/Paste existing Gutenberg blocks functionality for content and images._
- Choice fields [HIGH]
- Relational fields (except Relationship) [HIGH]
- Layout fields [HIGH]
- jQuery fields [LOW] _Maybe some preexisting react components?_
- Conditional fields [MID]
- Translation files (Everything is wrapped in i10n functions) [LOW]
- Style adaptions [LOW] _Gutenberg interferes with pre-existing ACF styles pretty much_

## Troubleshooting

**The ACF custom fields UI is broken (no JS)**

Just add the ``classic-editor`` parameter to the URL, then the ACF Scripts will be enqueued. I needed to dequeue the scripts because bound JS events interfered with the react components.

**Found a bug**

Create an issue in this repo.

## You have thoughts to share, want to collaborate?
Feel free to get in contact: create an issue here or write an email to iantsch@gmail.com or tweet @iantsch.
