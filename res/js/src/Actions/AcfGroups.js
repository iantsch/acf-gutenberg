export const fetchFieldsRequest = () => {
    return {
        type: 'FETCH_FIELDS_REQUEST'
    }
};

export const fetchFieldsSuccess = (postMeta) => {
    return {
        type: 'FETCH_FIELDS_SUCCESS',
        postMeta
    }
};

export const fetchFieldsError = (error) => {
    return {
        type: 'FETCH_FIELDS_ERROR',
        error
    }
};

export const updateField = (fieldKey, value) => {
    return  {
        type: 'UPDATE_FIELD',
        fieldKey,
        value
    }
};

export const triggerFieldsSave = () => {
    return {
        type: 'TRIGGER_FIELDS_SAVE'
    }
};

export const setPostId = postId => {
    return {
        type: 'SET_POST_ID',
        postId: parseInt(postId, 10)
    }
};

export const postFieldsRequest = () => {
    return {
        type: 'POST_FIELDS_REQUEST'
    }
};

export const postFieldsSuccess = () => {
    return {
        type: 'POST_FIELDS_SUCCESS'
    }
};

export const postFieldsError = (error) => {
    return {
        type: 'POST_FIELDS_ERROR',
        error
    }
};
