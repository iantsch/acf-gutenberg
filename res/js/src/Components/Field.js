import {Component} from 'react';

export default class Field extends Component {
    getClassNames() {
        return `acf-field acf-field-${this.props.type}`
    }
    render() {
        return (
            <div className={this.getClassNames()}>
                <div className={`acf-label`}>
                    <label for={`acf-${this.props.acfKey}`}>{this.props.label}</label>
                </div>
                <div className={`acf-input`}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
