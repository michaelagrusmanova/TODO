import React, {Component} from 'react';
import {ApiGet} from '../common/Api';
import {ApiPost} from '../common/Api';
import InputField from "../common/InputField";
import FlashMessage from '../common/FlashMessage';
import {BrowserRouter as Router, Link, Redirect, Route, Switch} from 'react-router-dom';

export default class UserLogin extends Component {
constructor(props){
            super(props);
        this.state = {
            povoleno: false,
            name: "",
            password: "",
            };
           /* this.filter = () => {
            let filter = document.getElementById("filter");
            let selectedFilter = filter.options[filter.selectedIndex].value;
            this.setState((prevState) => ({
                todoList: prevState.todoList,
                filter: selectedFilter
            }))
            };*/
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        }



    /*componentDidMount() {
        ApiPost('/api/users')
            .then(data => this.setState({povoleno: data}));
    }*/

    handleChange(e){
        // obsluha vstupů formuláře
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value,
        });
    }

    handleSubmit(e){
        e.preventDefault();
        const name = this.state.name;
        const password = this.state.password;
        ApiPost('/api/users/login', {name, password})
            .then(data => {
                this.setState({povoleno: data })
                window.location.reload()
        })
    }

    render() {
    const name = this.state.name;
    const password = this.state.password;
    const sent = this.state.sent;
    const success = this.state.success;
        return (
        	<div className="form-group">
                  <h1>Přihlášení</h1>
                <hr />

                    {sent && <FlashMessage theme={success ? 'success' : 'danger'}
                                           text={success ? 'OK :-)' : 'Něco se nepodařilo :-('}/>}

                    <form onSubmit={this.handleSubmit}>
                     <InputField required={true} type="text" name="name" min="3"
                        label="Username" prompt="Username"
                        value={this.state.name} handleChange={this.handleChange}/>

                     <InputField required={true} type="password" name="password" min="6"
                        label="Password" prompt="Password"
                        value={this.state.password} handleChange={this.handleChange}/>
                    
                    <input type="submit" className="btn btn-outline-primary" value="Přihlásit"/>
                    </form>
                	
                </div>
        );
    }
}
