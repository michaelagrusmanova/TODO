import React from 'react';

export function InputCheck(props) {
    // podporované typy pro element input
    const INPUTS = ['checkbox', 'radio'];

    // validace typu
    const type = props.type.toLowerCase();
    const checked = props.checked || undefined;

    if (!INPUTS.includes(type)) {
        return null;
    }

    return (
        <div className="form-group form-check">
            <label className="form-check-label">
                <input type={props.type} className="form-check-input" name={props.name}
                       value={props.value} checked={checked} onChange={props.handleChange}/> {props.label}
            </label>
        </div>
    );
}

export default InputCheck;