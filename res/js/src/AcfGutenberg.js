import Text from './Components/Text';
import NotSupported from './Components/NotSupported';

const { registerBlockType } = wp.blocks;

//TODO: Make this hookable
const ACF_COMPONENTS = {
    text: Text
};

export default function register(groups = {}) {
    groups = new Map (Object.entries(groups));
    groups.forEach(group => {
        let name = group.key.replace('_','-'),
            settings = {
                title: group.title,
                icon: 'shield',
                category: 'layout',
                supports: {
                    anchor: true,
                    customClassName: false,
                    html: false
                },

                edit: ( props ) => {
                    return (
                        <div id={`acf-${group.key}`} className={`${props.className} acf-postbox`}>
                            <h2>{ group.title }</h2>
                            <div className={`acf-fields`}>
                                {group.fields.map(item => {
                                    const TagName = typeof ACF_COMPONENTS[item.type] !== 'undefined' ? ACF_COMPONENTS[item.type] : NotSupported;
                                    return (
                                        <TagName {...item} acfKey={item.key} />
                                    )
                                })}
                            </div>
                            <pre>{ JSON.stringify(group, null, '  ')}</pre>
                        </div>
                    );
                },

                save: ( props ) => {
                    return null;
                }
            };
        registerBlockType(`acg/${name}`, settings);
    });
}

// Temporary hack
window.acg = { register };
