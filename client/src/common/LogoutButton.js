import React from "react";
import Cookies from "js-cookie";

export default class TasksPage extends React.Component {

    constructor(props) {
        super(props)
        
        this.logout = this.logout.bind(this)
        this.handleSuccessfulLogout = this.handleSuccessfulLogout.bind(this)
    }

    handleSuccessfulLogout(){
        Cookies.remove("loggedIn")
        window.location.reload()
      }
    
      logout() {
       fetch("/api/users/logout", {
          method: 'POST',
          credentials: 'include'
        }).then(this.handleSuccessfulLogout())
        .catch((error) => {
          console.log('Error: ', error)
        });
      }

    render() {
        return (
            <div>
                {Cookies.get("loggedIn") && <button onClick={this.logout}
                                                className="btn btn-sm btn-outline-danger">Odhlásit se
                                        </button>  }              
            </div>
        )
    }
}