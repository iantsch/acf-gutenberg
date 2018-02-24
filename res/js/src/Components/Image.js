import {Component} from 'react';
import Field from './Field';

const { mediaUpload } = wp.utils;
const { Placeholder, DropZone, IconButton, Button, FormFileUpload } = wp.components;
const { MediaUpload } = wp.blocks;

export default class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: null
        };
        this.fetchImage = false;
    }

    componentWillReceiveProps() {
        this.fetchImage = true;
    }

    componentDidUpdate() {
        if (this.fetchImage && !this.state.url && this.props.value) {
            this.fetchRemoteImage(this.props.value);
            this.fetchImage = false;
        }
    }

    fetchRemoteImage(attachmentId) {
        let fetch = {
            path: `/acf-gutenberg/v1/media=${attachmentId}&size=${this.props['preview_size']}`,
            method: 'GET',
            contentType: 'application/json',
            success: response => {
                this.setState({url: response})
            }
        };
        wp.apiRequest(fetch);
    }

    onSelectImage(media) {
        let newState = {url: media.url};
        if (media.hasOwnProperty('sizes') && media.sizes.hasOwnProperty(this.props['preview_size'])) {
            newState.url = media.sizes[this.props['preview_size']].url;
        }
        this.setState(newState);
        return this.props.onChange(this.props.acfKey, media.id);
    }

    onRemove() {
        this.setState({url: null});
        return this.props.onChange(this.props.acfKey, null);
    }

    onFilesDrop(files) {
        mediaUpload(files, media => this.onSelectImage(media));
    }

    onUploadFromFiles(event) {
        mediaUpload(event.target.files, media => this.onSelectImage(media));
    }

    getId() {
        return `${this.props.fieldId ? this.props.fieldId : 'acf-'}${this.props.acfKey}`;
    }

    renderControls() {
        return (
            <div className="acf-actions -hover" style={{display: 'block'}}>
                <MediaUpload
                    onSelect={media => this.onSelectImage(media)}
                    type="image"
                    value={this.getId()}
                    render={({ open }) => (
                        <IconButton
                          onClick={open}
                          icon="edit"
                          className="acf-icon -add dark"
                          label={wp.i18n.__("Edit image")}
                        />
                      )}
                />
                <a className="acf-icon -cancel dark" href="#" onClick={() => this.onRemove()}
                   title={wp.i18n.__("Remove")}/>
            </div>
        )
    }

    render() {
        return (
            <Field {...this.props}>
                <div className="acf-image-uploader">
                    {this.state.url ? (
                        <div className="image-wrap" style={{'max-width': '150px'}}>
                            <img src={this.state.url}/>
                            {this.renderControls()}
                        </div>
                    ) : (
                        <Placeholder key="placeholder"
                                     instructions={wp.i18n.__("Drag image here or insert from media library")}
                                     icon="format-image" label={this.props.label}>
                            <DropZone onFilesDrop={files => this.onFilesDrop(files)}/>
                            <FormFileUpload
                                id={this.getId()}
                                isLarge
                                className="wp-block-image__upload-button"
                                onChange={event => this.onUploadFromFiles(event)}
                                accept="image/*"
                            >
                                {wp.i18n.__("Upload")}
                            </FormFileUpload>
                            <MediaUpload
                                onSelect={media => this.onSelectImage(media)}
                                type="image"
                                value={this.getId()}
                                render={({ open }) => (<Button onClick={open} isLarge>
                                        {wp.i18n.__("Insert from Media Library")}
                                    </Button>)}
                            />
                        </Placeholder>
                    )}
                </div>
            </Field>
        );
    }
}
