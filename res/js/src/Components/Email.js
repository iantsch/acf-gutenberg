import {Component} from 'react';
import Field from '../Components/Field';

export default class Email extends Component {
    onChange(e) {
        return this.props.onChange(this.props.acfKey, e.currentTarget.value);
    }
    getAttributes() {
        let attributes = {
            id: `acf-${this.props.acfKey}`,
            name: `acf[${this.props.acfKey}]`,
            type: 'email',
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
