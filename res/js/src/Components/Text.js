import {Component} from 'react';
import Field from './Field';

export default class Text extends Component {
    render() {
        return (
            <Field {...this.props}>
                <div className={`acf-inputwrap`}>
                    <input type="text" id={`acf-${this.props.acfKey}`} placeholder={this.props.placeholder} name={`acf[${this.props.acfKey}]`} />
                </div>
            </Field>
        )
    }
}
