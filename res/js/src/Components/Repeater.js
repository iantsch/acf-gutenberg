import {Component} from 'react';
import Field from './Field';
import {ACF_COMPONENTS} from './Group';
import NotSupported from './NotSupported';

export default class Repeater extends Component {
    getValue() {
        return Array.isArray(this.props.value) ? this.props.value : [];
    }
    onChange(i, key, value) {
        let newValue = this.getValue();
        newValue[i][this.getNameByKey(key)] = value;
        this.props.onChange(this.props.acfKey, newValue);
    }
    getNameByKey(key) {
        let name = false;
        this.props['sub_fields'].forEach(field => {
            if (field.key === key && false === name) {
                name = field.name;
            }
        });
        return name;
    }
    getFieldProps(field, row, i) {
        let fieldProps = JSON.parse(JSON.stringify(field));
        fieldProps.fieldId = `'acf-${this.props.acfKey}-${i}-`;
        fieldProps.fieldName = `acf[${this.props.acfKey}][${i}]`;
        fieldProps.value = row[field.name];
        fieldProps.hideLabel = this.props.layout === 'table';
        fieldProps.tag = this.props.layout === 'table' ? 'td' : false;
        return fieldProps;
    }
    onModifyRows(i, type = 'add') {
        let newValue = this.getValue();
        if (type === 'add') {
            var emptyRow = {};
            this.props['sub_fields'].map(field => {
                emptyRow[field.name] = field['default_value'];
            });
            newValue.splice(i, 0, emptyRow);
        } else {
            newValue.splice(i, 1);
        }
        this.props.onChange(this.props.acfKey, newValue);
    }
    getThAttributes(wrapper) {
        let attributes = {
            className: 'acf-th'
        };
        if (wrapper.width) {
            attributes.style = { width: `${wrapper.width}%`};
        }
    }
    render() {
        let buttonLabel = this.props['button_label'] ? this.props['button_label'] : wp.i18n.__('Add Row');
        let value = this.getValue();
        return (
            <Field {...this.props}>
                <div className={`acf-repeater -${this.props.layout}`}>
                    <table className="acf-table">
                        {this.props.layout === 'table' ? (
                            <thead>
                            <tr>
                                <th className="acf-row-handle" />
                                {this.props['sub_fields'].map(field => {
                                    return (
                                        <th {...this.getThAttributes(field.wrapper)}>
                                            {field.label}
                                            {field.required ? (<span class="acf-required">&nbsp;*</span>) : ''}
                                            {field.instructions ? (<p className="description">{field.instructions}</p>) : ''}
                                        </th>
                                    )
                                })}
                                <th className="acf-row-handle" />
                            </tr>
                            </thead>
                        ) : ''}
                        <tbody>
                        {value.map((row, i) => {
                            let updateRow = (key, value) => {
                                this.onChange(i, key, value)
                            };
                            return (
                                <tr>
                                    <td className="acf-row-handle order"><span>{(i + 1)}</span></td>
                                    {this.props.layout === 'table' ? this.props['sub_fields'].map(field => {
                                        let TagName = ACF_COMPONENTS[field.type] ? ACF_COMPONENTS[field.type]: NotSupported;
                                        let fieldProps = this.getFieldProps(field, row, i);
                                        return (<TagName acfKey={field.key} {...fieldProps} onChange={updateRow} />);
                                    }) : (
                                        <td className={`acf-fields${this.props.layout === 'row'? ' -left' : ''}`}>
                                            {this.props['sub_fields'].map(field => {
                                                let TagName = ACF_COMPONENTS[field.type] ? ACF_COMPONENTS[field.type]: NotSupported;
                                                let fieldProps = this.getFieldProps(field, row, i);
                                                return (<TagName acfKey={field.key} {...fieldProps} onChange={updateRow} />);
                                            })}
                                        </td>
                                    )}
                                    <td className="acf-row-handle remove">
                                        <a class="acf-icon -plus small acf-js-tooltip" style={{display: 'block'}} title={wp.i18n.__('Add Row')} onClick={() => this.onModifyRows(i)} />
                                        <a class="acf-icon -minus small acf-js-tooltip" style={{display: 'block'}} title={wp.i18n.__('Remove Row')} onClick={() => this.onModifyRows(i, 'remove')} />
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                    <div className="acf-actions">
                        <a class="acf-button button button-primary" href="#" onClick={() => this.onModifyRows(value.length)}>{buttonLabel}</a>
                    </div>
                </div>
            </Field>
        )
    }
}
