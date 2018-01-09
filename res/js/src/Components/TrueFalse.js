import {Component} from 'react';
import Field from './Field';

export default class TrueFalse extends Component {
    onChange() {
        return this.props.onChange(this.props.acfKey, !(this.props.value));
    }
    getAttributes() {
        let attributes = {
            id: `${this.props.fieldId ? this.props.fieldId : 'acf-'}${this.props.acfKey}`,
            name: `${this.props.fieldName ? this.props.fieldName : 'acf'}[${this.props.acfKey}]`,
            onChange: () => this.onChange(),
            value: '1',
            type: 'checkbox',
            autocomplete: 'off'
        };
        if (this.props.ui ) {
            attributes.className = 'acf-switch-input';
        }
        if (this.props.value) {
            attributes.checked = true;
        }
        return attributes;
    }
    getUiClasses() {
        let classNames = [
            'acf-switch'
        ];
        if (this.props.value) {
            classNames.push('-on')
        }
        return classNames.join(' ');
    }
    render() {
        return (
            <Field {...this.props}>
                <div className="acf-true-false">
                    <label>
                        <input {...this.getAttributes()} />
                        {this.props.ui ? (
                            <div className={this.getUiClasses()}>
                                <span className="acf-switch-on" style={{minWidth: '33px'}}>{this.props['ui_on_text'] ? this.props['ui_on_text'] : wp.i18n.__('Yes')}</span>
                                <span className="acf-switch-off" style={{minWidth: '33px'}}>{this.props['ui_off_text'] ? this.props['ui_off_text'] : wp.i18n.__('No')}</span>
                                <div className="acf-switch-slider"></div>
                            </div>
                        ) : ''}
                        { this.props.message ? (
                            <span className="message">{this.props.message}</span>
                        ) : ''}
                    </label>
                </div>
            </Field>
        )
    }
}
