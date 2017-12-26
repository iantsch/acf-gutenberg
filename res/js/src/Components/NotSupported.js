import {Component} from 'react';

export default class NotSupported extends Component {
    render() {
        return (
            <div id={`acf-${this.props.acfKey}`}>
                <pre>Component type &quot;{this.props.type}&quot; is not supported!</pre>
            </div>
        )
    }
}
