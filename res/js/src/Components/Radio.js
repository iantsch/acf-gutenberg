import {Component} from 'react';
import Field from './Field';

export default class ButtonGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            init: false,
            other: ''
        };
    }
    onChange(e, value, initState) {
        this.setState({init: initState});
        return this.props.onChange(this.props.acfKey, value);
    }
    getRadioAttributes(value, initState = false) {
        let attributes = {
            type: 'radio',
            name: `${this.props.fieldName ? this.props.fieldName : 'acf'}[${this.props.acfKey}]`,
            onChange: (e) => this.onChange(e, value, initState),
            checked: ((this.props.value !== '' || this.state.init === true) && this.props.value === value) || (this.props.value === '' && this.state.init === false && this.props['default_value'] === value),
            value
        };
        if (this.props.required) {
            attributes.required = true;
        }
        return attributes;
    }
    onChangeOther(e) {
        this.setState({other: e.currentTarget.value});
        this.props.onChange(this.props.acfKey, e.currentTarget.value);
    }
    getOtherAttributes(){
        let attributes = {
            type: 'text',
            name: `${this.props.fieldName ? this.props.fieldName : 'acf'}[${this.props.acfKey}]`,
            onChange: e => this.onChangeOther(e),
            value: this.state.other,
            disabled: this.props.value !== this.state.other
        };
        if (this.props.value === this.state.other) {
            attributes.placeholder = wp.i18n.__('Enter your custom choice');
        }
        return attributes;
    }
    getClassNames() {
        let classNames = [
            'acf-radio-list',
            'acf-bl'
        ];
        return classNames.join(' ');
    }
    render() {
        return (
            <Field {...this.props}>
                <ul className={this.getClassNames()}>
                    {Object.keys(this.props.choices).map(option => {
                        return (
                            <li>
                                <label className={this.props.value === option ? 'selected' : ''}>
                                    <input {...this.getRadioAttributes(option)} />
                                    {this.props.choices[option]}
                                </label>
                            </li>
                        );
                    })}
                    {this.props['other_choice'] ? (
                        <li>
                            <label className={this.props.value === this.state.other ? 'selected other' : 'other'}>
                                <input {...this.getRadioAttributes(this.state.other, true)} />
                            </label>
                            <input {...this.getOtherAttributes()}/>
                        </li>
                    ) : ''}
                </ul>
            </Field>
        )
    }
}
