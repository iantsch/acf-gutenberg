import {Component} from 'react';
import Field from './Field';

export default class Select extends Component {
    onChange(e) {
        let options = e.target.options;
        let value = [];
        Array.from(options).map(option => {
            if (option.selected) {
                value.push(option.value);
            }
        });
        return this.props.onChange(this.props.acfKey, value);
    }
    getAttributes() {
        let attributes = {
            id: `${this.props.fieldId ? this.props.fieldId : 'acf-'}${this.props.acfKey}`,
            name: `${this.props.fieldName ? this.props.fieldName : 'acf'}[${this.props.acfKey}]`,
            onChange: (e) => this.onChange(e),
            value: this.props.value ? this.props.value : this.props['default_value'],
            size: 5
        };
        if (this.props.required) {
            attributes.required = true;
        }
        if (this.props.multiple) {
            attributes.multiple = true;
        }
        return attributes;
    }
    render() {
        return (
            <Field {...this.props}>
                <select {...this.getAttributes()}>
                    {Object.keys(this.props.choices).map(option => {
                        return (
                            <option value={option}>{this.props.choices[option]}</option>
                        );
                    })}
                </select>
            </Field>
        )
    }
}
