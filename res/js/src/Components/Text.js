import {Component} from 'react';
import Field from './Field';

export default class Text extends Component {
    onChange(e) {
        return this.props.onChange(this.props.acfKey, e.currentTarget.value);
    }
    getAttributes() {
        let attributes = {
            id: `${this.props.fieldId ? this.props.fieldId : 'acf-'}${this.props.acfKey}`,
            name: `${this.props.fieldName ? this.props.fieldName : 'acf'}[${this.props.acfKey}]`,
            type: 'text',
            onChange: (e) => this.onChange(e),
            value: this.props.value ? this.props.value : this.props['default_value']
        };
        if (this.props.placeholder !== '') {
            attributes.placeholder = this.props.placeholder;
        }
        if (this.props.required) {
            attributes.required = true;
        }
        return attributes;
    }
    render() {
        return (
            <Field {...this.props}>
                <div className={`acf-input-wrap`}>
                    <input {...this.getAttributes()}/>
                </div>
            </Field>
        )
    }
}
