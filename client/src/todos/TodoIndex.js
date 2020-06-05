import React, {Component} from 'react';
import {ApiGet} from '../common/Api';
import TodoTable from './TodoTable';
import LogoutButton from '../common/LogoutButton';

export default class TodoIndex extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            todos: [],
            filter: "vse"
};
            this.filter = () => {
            let filter = document.getElementById("filter");
            let selectedFilter = filter.options[filter.selectedIndex].value;
            this.setState((prevState) => ({
                todoList: prevState.todoList,
                filter: selectedFilter
            }))
};
        this.delete = this.delete.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    delete() {
    ApiGet('/api/todos')
        .then(data => this.setState({todos: data}));
    }

    componentDidMount() {
        ApiGet('/api/todos')
            .then(data => this.setState({todos: data}));
        ApiGet('/api/todos?complete=true')
            .then(data => this.setState({todoList2: data}));
        ApiGet('/api/todos?complete=false')
            .then(data => this.setState({todoList: data}));
    }

    handleChange(e){
        this.setState({
            filter: {[e.target.name]: e.target.value}});
    }

    handleSubmit(e){
        e.preventDefault();
        const params = this.state.filter;
        ApiGet('/api/todos', params)
            .then(data => this.setState({todos: data}));
    }

    render() {
        return (
            <div>
                <h1>ToDo List</h1>
                <LogoutButton />
                <hr />
                <label htmlFor="filter"><strong>Zobrazit úkoly:</strong></label>
                <br />
                <select id="filter" onChange={this.filter}>
                    <option value="vse">Vše</option>
                    <option value="splneno">Splněné</option>
                    <option value="nesplneno">Nesplněné</option>
                </select>
                <hr />
                <TodoTable delete={this.delete} items={this.state.todos} label="Počet všech todo:" filter={this.state.filter} />
                <hr />



            </div>
        );
    }
}