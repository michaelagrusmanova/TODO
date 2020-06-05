import React, {Component} from 'react';
import InputField from "../common/InputField";
import InputCheck from "../common/InputCheck";
import FlashMessage from '../common/FlashMessage';
import {ApiGet, ApiPost, ApiPut} from '../common/Api';
import {BrowserRouter as Router, Link, Redirect, Route, Switch} from 'react-router-dom';

export default class TodoForm extends Component {

    constructor(props) {
        // inicializace hodnot
        super(props);

        this.state = {
            todoId: null,
            text: '',
            complete: false,

            sent: false,
            success: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        // obsluha vstupů formuláře
        const target = e.target;
        let temp;
        if(target.name === 'complete'){
            temp = target.checked;
        } else{
            temp = target.value;
        }
        const name = target.name;
        const value = temp;
        this.setState({
            [name]: value,
        });
    }

    handleSubmit(e) {
        //obsluha odeslání formuláře
        e.preventDefault();
        const body = {
            text: this.state.text,
            complete: this.state.complete, 
        };

        (this.state.todoId
            ? ApiPut('/api/todos/' + this.props.match.params.id, body)
            : ApiPost('/api/todos/', body))
        .then((data) => {
            console.log(data);
            this.setState({
                sent:true,
                success:true,
            });
        }).catch((error) => {
            console.error(error);
            this.setState({
                sent: true,
                success: false,
            });
        });
    }

    componentDidMount() {
        //načtní existujícího záznamu
        const id = this.props.match.params.id || null;
        if(id){
            this.setState({todoId: id});
            ApiGet('/api/todos/' + id)
            .then(data => {
                this.setState({
                    text: data.text,
                    complete: data.complete,
                });
            });
        }
    }



render() {
    //vykreslení 
    const id = this.state.todoId;
    const sent = this.state.sent;
    const success = this.state.success;

    return (
        <div>
            <h1>{id ? 'Upravit' : 'Nové'} Todo</h1><hr/>

            {sent && <FlashMessage theme={success ? 'success' : 'danger'}
                                   text={success ? 'OK :-)' : 'Něco se nepodařilo :-('}/>}

            <form onSubmit={this.handleSubmit}>
             <InputField required={true} type="text" name="text" min="3"
                label="TODO" prompt="Váš úkol:"
                value={this.state.text} handleChange={this.handleChange}/>

            <InputCheck type="checkbox" name="complete" label="Splněno"
            value={this.state.complete} handleChange={this.handleChange}/>
            <div className="btn-group">
            <input type="submit" className="btn btn-outline-primary" value="Uložit"/>
            <Link to={"/todos"} className="btn btn-outline-info">Zpět</Link>
            </div>
            </form>

        </div>
    )
}
}