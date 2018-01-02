import {combineReducers} from 'redux';

const Key = (state = '', action) => {
    switch (action.type) {
        case 'SET_FIELDS_KEY':
            return action.key;
        default:
            return state;
    }
};

const PostId = (state = 0, action) => {
    switch (action.type) {
        case 'SET_POST_ID':
            return action.postId;
        default:
            return state;
    }
};

const updateFieldByKey = (obj, key, value) => {
    for (var property in obj) {
        if (obj.hasOwnProperty(property)){
            if (typeof obj[property] === 'object') {
                obj[property] = updateFieldByKey(obj[property], key, value);
            }
            if (property === 'key' && obj[property] === key) {
                obj.value = value;
                break;
            }
        }
    }
    return obj;
};

const updateFields = (obj, values, depth = 0) => {
    Object.keys(values).map(fieldName => {
        if (values[fieldName].hasOwnProperty('key')) {
            let key = values[fieldName].key;
            if (obj.hasOwnProperty(key)) {
                obj[key].value = values[fieldName].value;
            }
        }
    });
    return obj;
};

const Fields = (state = {}, action) => {
    let newState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case 'UPDATE_FIELD':
            newState = updateFieldByKey(newState, action.fieldKey, action.value);
            return newState;
        case 'FETCH_FIELDS_SUCCESS':
            newState = updateFields(newState, action.postMeta);
            return newState;
        case 'FETCH_FIELDS_ERROR':
            return state;
        default:
            return state;
    }
};
const doFetching = (state = false, action) => {
    switch (action.type) {
        case 'SET_POST_ID':
            return true;
        case 'FETCH_FIELDS_REQUEST':
            return state;
        case 'FETCH_FIELDS_SUCCESS':
            return false;
        case 'FETCH_FIELDS_ERROR':
            return false;
        default:
            return state;
    }
};
const isPosting = (state = false, action) => {
    switch (action.type) {
        case 'TRIGGER_FIELDS_SAVE':
            return state;
        case 'POST_FIELDS_REQUEST':
            return true;
        case 'POST_FIELDS_SUCCESS':
            return false;
        case 'POST_FIELDS_ERROR':
            return false;
        default:
            return state;
    }
};
const doPosting = (state = false, action) => {
    switch (action.type) {
        case 'TRIGGER_FIELDS_SAVE':
            return true;
        case 'POST_FIELDS_REQUEST':
            return state;
        case 'POST_FIELDS_SUCCESS':
            return false;
        case 'POST_FIELDS_ERROR':
            return false;
        default:
            return state;
    }
};
const isPosted = (state = false, action) => {
    switch (action.type) {
        case 'TRIGGER_FIELDS_SAVE':
        case 'POST_FIELDS_REQUEST':
            return null;
        case 'POST_FIELDS_SUCCESS':
            return {
                status: 200,
                message: null
            };
        case 'POST_FIELDS_ERROR':
            return {
                status: action.status,
                message: action.message
            };
        default:
            return state;
    }
};

const Group = combineReducers({
    Key,
    PostId,
    Fields,
    doFetching,
    doPosting,
    isPosting,
    isPosted
});

export default Group;
