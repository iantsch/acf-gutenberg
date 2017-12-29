import {connect} from 'react-redux';

import Group from '../Components/Group';
import {updateField, triggerFieldsSave, setPostId} from '../Actions/AcfGroups';

const mapStateToProps = (state, ownProps) => {
    return state;
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onChange: (fieldKey, value) => {
            // Hack to make save button available
            ownProps.onGroupChange(Date.now());

            dispatch(updateField(fieldKey, value))
        },
        onSave: () => {
            dispatch(triggerFieldsSave())
        },
        setPostId: postId => {
            dispatch(setPostId(postId))
        }
    }
};

const AcfGroup = connect(mapStateToProps, mapDispatchToProps)(Group);

export default AcfGroup;
