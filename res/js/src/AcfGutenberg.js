const { registerBlockType } = wp.blocks;

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
                        <div className={ props.className }>
                    <h5>{ group.title }</h5>
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
