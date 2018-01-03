import {Component} from 'react';

export default class Field extends Component {
    getClassNames() {
        let classes = [
            'acf-field',
            `acf-field-${this.props.type}`
        ];
        if (this.props.wrapper.class) {
            classes.push(this.props.wrapper.class);
        }
        return classes;
    }
    getAttributes() {
        let attributes = {
            className: this.getClassNames().join(' ')
        };
        if (this.props.wrapper.id) {
            attributes.id = this.props.wrapper.id;
        }
        if (this.props.wrapper.width) {
            attributes.style = { width: `${this.props.wrapper.width}%`};
        }
        return attributes;
    }
    getFieldId() {
        return `${this.props.fieldId ? this.props.fieldId : 'acf-'}${this.props.acfKey}`;
    }
    render() {
        const TagName = this.props.tag ? this.props.tag : 'div';
        return (
            <TagName {...this.getAttributes()}>
                {this.props.hideLabel ? '' : (
                    <div className={`acf-label`}>
                        <label for={this.getFieldId()}>
                            {this.props.label}
                            {this.props.required ? (<span class="acf-required">&nbsp;*</span>) : ''}
                        </label>
                        {this.props.instructions ? (<p className="description">{this.props.instructions}</p>) : ''}
                    </div>
                )}
                <div className={`acf-input`}>
                    {this.props.prepend ? (<div class="acf-input-prepend" dangerouslySetInnerHTML={{__html: this.props.prepend}}/>) : ''}
                    {this.props.append ? (<div class="acf-input-append" dangerouslySetInnerHTML={{__html: this.props.append}}/>) : ''}
                    {this.props.children}
                </div>
            </TagName>
        )
    }
}
