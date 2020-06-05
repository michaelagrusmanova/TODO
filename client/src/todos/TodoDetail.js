import React, {Component} from 'react';
import {ApiGet} from '../common/Api';
import {BrowserRouter as Router, Link, Redirect, Route, Switch} from 'react-router-dom';

export default class TodoDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            todoText: '',
            complete: false,
        }
    }

    componentDidMount() {
        ApiGet('/api/todos/' + this.props.match.params.id)
            .then(data => this.setState({
                todoText: data.text,
                complete: data.complete,

            }))
            .catch((error) => {
                console.error(error);
            });
    }

    render() {

        return (
            <div>
                <h1>Todo Detail</h1><hr />
                
                        <h3>{this.state.todoText}</h3>
                    <p>
                        <strong>Hotovo: </strong>{this.state.complete ? 'ANO' : 'NE'}<br/>
                    </p>
                    <Link to={"/todos"} className="btn btn-outline-info">Zpět</Link>
            </div>
        )
    }

}