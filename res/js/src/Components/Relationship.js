import {Component} from 'react';
import Field from './Field';

export default class Relationship extends Component {
    constructor(props) {
        super(props);
        this.state = {
            s: '',
            postType: '',
            postTypes: {},
            taxonomy: '',
            terms: {},
            choices: {},
            posts: [],
            paged: 1
        };
        this.fetchPosts = false;
        this.fetchRemote('choices', this.getChoicesFilter());
        if (this.props.filters.indexOf('post_type') > -1 ) {
            this.fetchRemote('postTypes', this.props['post_type']);
        }
        if (this.props.filters.indexOf('taxonomy') > -1 ) {
            this.fetchRemote('terms', this.props.taxonomy);
        }
    }
    onChange(postId, action) {
        let value = JSON.parse(JSON.stringify(this.props.value ? this.props.value : []));
        if (action === 'add') {
            value.push(postId);
        } else if (action === 'remove') {
            value.splice(value.indexOf(postId), 1);
        }
        return this.props.onChange(this.props.acfKey, value);
    }
    getChoicesFilter(replace = false) {
        let filter = [
            `s|${this.state.s}`,
            `postType|${this.state.postType}`,
            `taxonomy|${this.state.taxonomy}`,
            `paged|${this.state.paged}`
        ];
        if (false !== replace) {
            filter.forEach((f, i) => {
                Object.keys(replace).map(key => {
                    if (f.includes(key)) {
                        filter[i] = `${key}|${replace[key]}`;
                    }
                })
            });
        }
        return filter;

    }
    onFilter(e, type) {
        let newState = {
            paged: 1
        };
        newState[type] = e.target.value;
        this.fetchRemote('choices', this.getChoicesFilter(newState));
        this.setState(newState);
    }
    onPaginate() {
        let newState = {
            paged: ++this.state.paged
        };
        this.fetchRemote('choices', this.getChoicesFilter(newState));
        this.setState(newState);
    }
    fetchRemote(targetState, filter) {
        let fetch = {
            path: `/acf-gutenberg/v1/${targetState}=${filter.length > 0 ? filter.join(','):'all'}`,
            method: 'GET',
            contentType: 'application/json',
            success: response => {
                let newState = {};
                newState[targetState] = response;
                this.setState(newState)
            }
        };
        wp.apiRequest(fetch);
    }
    getHiddenAttributes() {
        let attributes = {
            id: `${this.props.fieldId ? this.props.fieldId : 'acf-'}${this.props.acfKey}`,
            name: `${this.props.fieldName ? this.props.fieldName : 'acf'}[${this.props.acfKey}]`,
            type: 'hidden',
            onChange: (e) => this.onChange(e),
            value: JSON.stringify(this.props.value ? this.props.value : this.props['default_value'])
        };
        if (this.props.required) {
            attributes.required = true;
        }
        return attributes;
    }
    componentWillReceiveProps() {
        this.fetchPosts = true;
    }
    componentDidUpdate() {
        if (this.fetchPosts) {
            this.fetchRemote('posts', this.props.value ? this.props.value : []);
            this.fetchPosts = false;
        }
    }
    render() {
        return (
            <Field {...this.props}>
                <div id={`acf-${this.props.acfKey}`} className="acf-relationship" >
                    <div className={`filters -f${this.props.filters.length}`}>
                        {this.props.filters.indexOf('search') > -1 ? (
                            <div className="filter -search">
                                <span>
                                    <input type="text" placeholder={wp.i18n.__('Search…')} value={this.state.s} onChange={(e)=> this.onFilter(e, 's')}/>
                                </span>
                            </div>
                        ) :''}
                        {this.props.filters.indexOf('post_type') > -1 ? (
                            <div className="filter -post_type">
                                <span>
                                    <select onChange={(e)=> this.onFilter(e, 'postType')}>
                                        <option value="">{wp.i18n.__('Select post type')}</option>
                                        {Object.keys(this.state.postTypes).map(postType => {
                                            return (<option value={postType}>{this.state.postTypes[postType]}</option>);
                                        })}
                                    </select>
                                </span>
                            </div>
                        ) :''}
                        {this.props.filters.indexOf('taxonomy') > -1 ? (
                            <div className="filter -taxonomy">
                                <span>
                                    <select onChange={(e)=> this.onFilter(e, 'taxonomy')}>
                                        <option value="">{wp.i18n.__('Select taxonomy')}</option>
                                        {Object.keys(this.state.terms).map(taxonomy => {
                                            return (
                                                <optgroup label={this.state.terms[taxonomy].label}>
                                                    {Object.keys(this.state.terms[taxonomy].choices).map(option => {
                                                        return (<option value={option}>{this.state.terms[taxonomy].choices[option]}</option>);
                                                    })}
                                                </optgroup>
                                            );
                                        })}
                                    </select>
                                </span>
                            </div>
                        ) :''}
                    </div>
                    <div className="selection">
                        <div className="choices">
                            <ul className="acf-bl list">
                                {Object.keys(this.state.choices).length === 0 && this.state.choices.constructor === Object ? (
                                    <li>{wp.i18n.__('Too many filters')}</li>
                                ) : Object.keys(this.state.choices).map(postType => {
                                    //TODO: Adding Pagination on scroll
                                    return (
                                        <li>
                                            <span className="acf-rel-label">
                                                {wp.i18n.sprintf(wp.i18n.__('%1$s (%2$s)'), this.state.postTypes[postType], postType)}
                                            </span>
                                            <ul className="acf-bl">
                                                {Object.keys(this.state.choices[postType]).map(postId => {
                                                    return (
                                                        <li>
                                                            {this.state.posts.hasOwnProperty(postId) ? (
                                                                <span className="acf-rel-item disabled">
                                                                    {this.state.choices[postType][postId]}
                                                                </span>
                                                            ) : (
                                                                <span className="acf-rel-item" onClick={()=> this.onChange(postId, 'add')}>
                                                                    {this.state.choices[postType][postId]}
                                                                </span>
                                                            )}
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        <div className="values">
                            <ul className="acf-bl list ui-sortable">
                                {Object.keys(this.state.posts).length === 0 && this.state.posts.constructor === Object ? (
                                    <li>{wp.i18n.__('Too many filters')}</li>
                                ) : Object.keys(this.state.posts).map(postId => {
                                    return (
                                        <li>
                                            <span className="acf-rel-item">
                                                {this.state.posts[postId]}
                                                <a href="#" className="acf-icon -minus small dark" onClick={()=> this.onChange(postId, 'remove')} />
                                            </span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </Field>
        )
    }
}
