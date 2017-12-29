import {Component} from 'react';
import Field from '../Components/Field';

export default class Text extends Component {
    onChange(e) {
        return this.props.onChange(this.props.acfKey, e.currentTarget.value);
    }
    render() {
        return (
            <Field {...this.props}>
                <div className={`acf-inputwrap`}>
                    <input
                        type="text"
                        id={`acf-${this.props.acfKey}`}
                        placeholder={this.props.placeholder}
                        name={`acf[${this.props.acfKey}]`}
                        value={this.props.value}
                        onChange={(e) => this.onChange(e)}
                    />
                </div>
            </Field>
        )
    }
}
