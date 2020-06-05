import React from 'react';

export function InputSelect(props) {

const multiple = props.multiple;
const required = props.required || false;

    // příznak označení prázdné hodnoty
    const emptySelected = multiple ? (props.value.length === 0) : (!props.value);

    return (
        <div className="form-group">
            <label>{props.label}:</label>
            <select required={required} className="browser-default custom-select" multiple={multiple}
                    name={props.name} onChange={props.handleChange}>

                {required
                    ? <option disabled selected={emptySelected}>{props.prompt}</option>
                    : <option key={0} value="" selected={emptySelected}>({props.prompt})</option>}

                    <option value="completed" name={props.name}>Splněno</option>
                    <option value="incompleted" name={props.name}>Nesplněno</option>
            </select>
        </div>
    );
}

export default InputSelect;