import AcfGroup from './Containers/AcfGroup';

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import Reducers from './Reducers/Reducers'
import Services from './Services/Services';

const { registerBlockType } = wp.blocks;

export default function register(groups = {}) {
    groups = new Map (Object.entries(groups));
    groups.forEach(group => {
        let defaultState = {
            Group : {
                Key: group.key,
                Fields: {}
            }
        };
        group.fields.map(item => {
            defaultState.Group.Fields[item.key] = item;
        });
        let store = createStore(Reducers, defaultState);
        Services(store);

        let name = group.key.replace('_','-'),
            settings = {
                title: group.title,
                icon: 'shield',
                category: 'common',
                isPrivate: true,
                supports: {
                    anchor: true,
                    customClassName: false,
                    html: false
                },

                // Hack to make save button available
                attributes: {
                    content: {
                        type: "timestamp",
                        source: "meta",
                        meta: `${group.key}_timestamp`
                    }
                },

                edit: ({ attributes, setAttributes }) => {
                    return (
                        <Provider store={store}>
                            <AcfGroup title={group.title} onGroupChange={(now) => setAttributes(`${group.key}_timestamp`, now)} />
                        </Provider>
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
