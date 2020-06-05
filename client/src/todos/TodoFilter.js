import React, {Component} from 'react';
import InputSelect from "../common/InputSelect";
import InputField from "../common/InputField";

export default class TodoFilter extends Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.props.handleChange(e);
    }

    handleSubmit(e) {
        this.props.handleSubmit(e);
    }

    render() {
        const filter = this.props.filter;

        return (
            <form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="col">
                             <InputSelect name="complete" items={this.props.complete} handleChange={this.handleChange}
                                label="Stav" prompt="nevybrán" value={filter.complete} />
                             </div>
                             <div className="col">
                        <input type="submit" className="btn btn-secondary float-right" value={this.props.confirm} />

                </div>
                


            </form>
        );
    }

}