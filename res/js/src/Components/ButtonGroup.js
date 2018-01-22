import {Component} from 'react';
import Field from './Field';

export default class ButtonGroup extends Component {
    onChange(e, value) {
        return this.props.onChange(this.props.acfKey, value);
    }
    getButtonAttributes(value) {
        let attributes = {
            type: 'radio',
            name: `${this.props.fieldName ? this.props.fieldName : 'acf'}[${this.props.acfKey}]`,
            onChange: (e) => this.onChange(e, value),
            checked: this.props.value === value || (this.props.value === '' && this.props['default_value'] === value),
            value
        };
        if (this.props.required) {
            attributes.required = true;
        }
        return attributes;
    }
    getClassNames() {
        let classNames = [
            'acf-button-group'
        ];
        if (this.props.layout === 'vertical') {
            classNames.push('-vertical');
        }
        return classNames.join(' ');
    }
    render() {
        return (
            <Field {...this.props}>
                <div className={this.getClassNames()}>
                    {Object.keys(this.props.choices).map(option => {
                        return (
                            <label className={this.props.value === option ? 'selected' : ''}>
                                <input {...this.getButtonAttributes(option)} />
                                {this.props.choices[option]}
                            </label>
                        );
                    })}
                </div>
            </Field>
        )
    }
}
