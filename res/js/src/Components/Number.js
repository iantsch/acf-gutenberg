import {Component} from 'react';
import Field from '../Components/Field';

export default class Number extends Component {
    onChange(e) {
        return this.props.onChange(this.props.acfKey, e.currentTarget.value);
    }
    getAttributes() {
        let attributes = {
            id: `acf-${this.props.acfKey}`,
            name: `acf[${this.props.acfKey}]`,
            type: 'number',
            onChange: (e) => this.onChange(e),
            value: this.props.value ? this.props.value : this.props['default_value'],
            step: this.props.step ? this.props.step : 'any'
        };
        if (this.props.placeholder !== '') {
            attributes.placeholder = this.props.placeholder;
        }
        if (this.props.required) {
            attributes.required = true;
        }
        if (this.props.min !== '') {
            attributes.min = this.props.min;
        }
        if (this.props.max !== '') {
            attributes.max = this.props.max;
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
