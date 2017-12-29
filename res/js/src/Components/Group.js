import {Component} from 'react';
import Text from './Text';
import NotSupported from './NotSupported';

// TODO: Make this hookable
const ACF_COMPONENTS = {
    text: Text
};

export default class Group extends Component {
    constructor(props) {
        super(props);
        const body = document.body;
        body.addEventListener('click', (e) => this.onSave(e));
        this.onPostId();
    }
    onSave(event) {
        var element = event.target;
        if( element.classList.contains("editor-post-publish-button")){
            return this.props.onSave();
        }
    }
    onPostId() {
        let postId = document.getElementById('post_ID');
        if (postId !== null) {
            this.props.setPostId(postId.value);
        } else {
            setTimeout(() => this.onPostId(), 10);
        }
    }
    render() {
        let fields = Object.keys(this.props.Group.Fields);
        return (
            <div id={`acf-${this.props.Group.Key}`} className={this.props.className}>
                <h2>{ this.props.title }</h2>
                <div className={`acf-fields`}>
                    {fields.map(itemKey => {
                        const ITEM = this.props.Group.Fields[itemKey];
                        const TagName = typeof ACF_COMPONENTS[ITEM.type] !== 'undefined' ? ACF_COMPONENTS[ITEM.type] : NotSupported;
                        return (
                            <TagName {...ITEM} acfKey={ITEM.key} onChange={this.props.onChange} />
                        )
                    })}
                </div>
                <pre>{ JSON.stringify(this.props.Group.Fields, null, '  ')}</pre>
            </div>
        )
    }
}
