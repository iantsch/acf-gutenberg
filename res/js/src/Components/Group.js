import {Component} from 'react';
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import Text from './Text';
import Textarea from './Textarea';
import Number from './Number';
import Range from './Range';
import Email from './Email';
import Url from './Url';
import Password from './Password';
import Relationship from './Relationship';
import Repeater from './Repeater';
import Image from './Image';
import Select from './Select';
import TrueFalse from './TrueFalse';
import ButtonGroup from './ButtonGroup';
import Radio from './Radio';
import Checkbox from './Checkbox';
import FlexibleContent from './FlexibleContent';
import NotSupported from './NotSupported';

// TODO: Make this hookable
export const ACF_COMPONENTS = {
    text: Text,
    textarea: Textarea,
    number: Number,
    range: Range,
    email: Email,
    url: Url,
    password: Password,
    relationship: Relationship,
    repeater: Repeater,
    image: Image,
    select: Select,
    ['true_false']: TrueFalse,
    ['button_group']: ButtonGroup,
    radio: Radio,
    checkbox: Checkbox,
    ['flexible_content']: FlexibleContent
};

@DragDropContext(HTML5Backend)
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
            <div id={`acf-${this.props.Group.Key}`} className="acg-container ">
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
