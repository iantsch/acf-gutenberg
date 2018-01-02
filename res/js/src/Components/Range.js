import {Component} from 'react';
import Field from '../Components/Field';

export default class Range extends Component {
    onChange(e) {
        return this.props.onChange(this.props.acfKey, e.currentTarget.value);
    }
    getAttributes(type) {
        let attributes = {
            id: `${this.props.fieldId ? this.props.fieldId : 'acf'}-${this.props.acfKey}${type === 'number' ? '-alt' : ''}`,
            type: type,
            onChange: (e) => this.onChange(e),
            step: this.props.step ? this.props.step : 1,
            min: this.props.min ? this.props.min : 0,
            max: this.props.max ? this.props.max : 100
        };
        attributes.value = this.props.value ? this.props.value : (this.props['default_value'] ? this.props['default_value'] : attributes.min);
        if (type === 'range') {
            attributes.name = `${this.props.fieldName ? this.props.fieldName : 'acf'}[${this.props.acfKey}]`;
        }
        if (type === 'number') {
            attributes.style = {width: '3.9em'};
        }
        if (type === 'number' && this.props.placeholder !== '') {
            attributes.placeholder = this.props.placeholder;
        }
        if (type === 'range' && this.props.required) {
            attributes.required = true;
        }
        return attributes;
    }
    render() {
        return (
            <Field {...this.props}>
                <div className={`acf-range-wrap`}>
                    <input {...this.getAttributes('range')}/>
                    <input {...this.getAttributes('number')}/>
                </div>
            </Field>
        )
    }
}
