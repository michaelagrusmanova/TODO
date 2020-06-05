import React, {Component} from 'react';
import {BrowserRouter as Router, Link, Redirect, Route, Switch} from 'react-router-dom';
import {ApiDelete} from '../common/Api';

export default class TodoTable extends Component {
    delete(id) {
        ApiDelete('/api/todos/' + id)
            .then(data => console.log(data));
            window.location.reload();
    }

    render() {

        return (
            <div> 
            <p>{this.props.label} {this.props.items.length}</p>
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Název</th>
                        <th colSpan={3}>Akce</th>
                    </tr>
                    </thead>
                    
                    <tbody>

                    {this.props.filter === 'vse' && this.props.items.map((item, index) =>
                            <tr key={index + 1}>
                                <td>{index + 1}</td>
                                <td>{item.text}</td>
                                <td>
                                    <div className="btn-group">

                                        <Link to={"/todos/show/" + item._id}
                                              className="btn btn-sm btn-outline-primary">Zobrazit</Link>
                                        <Link to={"/todos/edit/" + item._id}
                                            className="btn btn-sm btn-outline-warning">Upravit</Link>
                                        <button onClick={this.delete.bind(this, item._id)}
                                                className="btn btn-sm btn-outline-danger">Odstranit
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                    }
                    {this.props.filter==='splneno' && this.props.items.map((item, index) =>
                            item.complete === true && (
                            <tr key={index + 1}>
                                <td>{index + 1}</td>
                                <td>{item.text}</td>
                                <td>
                                    <div className="btn-group">

                                        <Link to={"/todos/show/" + item._id}
                                              className="btn btn-sm btn-outline-primary">Zobrazit</Link>
                                        <Link to={"/todos/edit/" + item._id}
                                            className="btn btn-sm btn-outline-warning">Upravit</Link>
                                        <button onClick={this.delete.bind(this, item._id)}
                                                className="btn btn-sm btn-outline-danger">Odstranit
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                        
                    )
                }
                {this.props.filter==='nesplneno' && this.props.items.map((item, index) =>
                            item.complete === false && (
                            <tr key={index + 1}>
                                <td>{index + 1}</td>
                                <td>{item.text}</td>
                                <td>
                                    <div className="btn-group">

                                       <Link to={"/todos/show/" + item._id}
                                              className="btn btn-sm btn-outline-primary">Zobrazit</Link>
                                        <Link to={"/todos/edit/" + item._id}
                                            className="btn btn-sm btn-outline-warning">Upravit</Link>
                                        <button onClick={this.delete.bind(this, item._id)}
                                                className="btn btn-sm btn-outline-danger">Odstranit
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                        
                    )
                }
                    </tbody>
                </table>
                <Link to={"/todos/create"} className="btn btn-outline-success">Nový todo</Link>
            </div>
 );
    }

}