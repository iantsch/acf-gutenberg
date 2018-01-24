import {Component} from 'react';
import Field from './Field';

export default class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            custom: []
        };
    }
    getValue() {
        let value = Array.isArray(this.props.value) ? this.props.value : [];
        value = value.filter( ( maybeCustomValue ) => {
            return this.state.custom.indexOf( maybeCustomValue ) < 0;
        });
        return value;
    }
    onChange(value) {
        let currentValue = this.getValue();

        let index = currentValue.indexOf(value);
        if (index > -1) {
            currentValue.splice(index, 1);
        } else {
            currentValue.push(value);
        }
        return this.props.onChange(this.props.acfKey, currentValue.concat(this.state.custom));
    }
    getCheckboxAttributes(value, i = false) {
        let currentValue = this.getValue();
        let attributes = {
            type: 'checkbox',
            name: `${this.props.fieldName ? this.props.fieldName : 'acf'}[${this.props.acfKey}][]`,
            onChange: () => this.onChange(value),
            checked: currentValue.indexOf(value) > -1 || (currentValue === [] && this.state.custom.length === 0 && this.props['default_value'] === value),
            value
        };
        if (this.props.required) {
            attributes.required = true;
        }
        if (i !== false) {
            attributes.onChange = () => this.removeCustom(i);
            attributes.checked = true;
        }
        return attributes;
    }
    onChangeCustom(e, i) {
        let custom = this.state.custom,
            currentValue = this.getValue();
        custom[i] = e.currentTarget.value;
        this.setState({custom});
        this.props.onChange(this.props.acfKey, currentValue.concat(custom));
    }
    getCustomAttributes(value, i){
        let attributes = {
            type: 'text',
            name: `${this.props.fieldName ? this.props.fieldName : 'acf'}[${this.props.acfKey}][${i}]`,
            onChange: e => this.onChangeCustom(e,i),
            placeholder: wp.i18n.__('Enter your custom choice'),
            value
        };
        return attributes;
    }
    getClassNames() {
        let classNames = [
            'acf-checkbox-list',
            'acf-bl'
        ];
        if (this.props.layout === 'vertical') {
            classNames.push('-vertical');
        }
        return classNames.join(' ');
    }
    addCustom() {
        let custom = this.state.custom;
        custom.push('');
        this.setState({custom});
    }
    removeCustom(i) {
        let custom = this.state.custom;
        custom.splice(i, 1);
        this.setState({custom});
    }
    render() {
        return (
            <Field {...this.props}>
                <ul className={this.getClassNames()}>
                    {Object.keys(this.props.choices).map(option => {
                        return (
                            <li>
                                <label className={this.props.value === option ? 'selected' : ''}>
                                    <input {...this.getCheckboxAttributes(option)} />
                                    {this.props.choices[option]}
                                </label>
                            </li>
                        );
                    })}
                    {this.props['allow_custom'] ? ([
                        this.state.custom.map((option, i) => {
                            return (
                                <li>
                                    <label className="selected other">
                                        <input {...this.getCheckboxAttributes(option, i)} />
                                    </label>
                                    <input {...this.getCustomAttributes(option, i)}/>
                                </li>
                            )
                        }),
                        <li><a href="#" className="button acf-add-checkbox" onClick={() => this.addCustom(this.state.custom.length)}>{wp.i18n.__('Add new choice')}</a></li>
                    ]) : ''}
                </ul>
            </Field>
        )
    }
}
