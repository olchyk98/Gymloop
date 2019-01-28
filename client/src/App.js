import React, { Component, Fragment } from 'react';

// Pages
import Home from './pages/home';
import Login from './pages/login';

// Stuff
import { cookieControl } from './utils';
import links from './links';

// Router
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router'

// Redux
import reducers from './reducers';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const reduxStore = createStore(reducers);

//
const NeedleRoute = ({ path, condition, component: Component, redirect: Redirect, ...settings }) => (
	<Route
		path={ path }
		{ ...settings }
		component={props => (condition) ? <Component { ...props } /> : <Redirect { ...props } to={ Redirect } /> }
	/>
);

// IN
class App extends Component {
  constructor(props) {
    super(props);

    this.cookieID = cookieControl.get("userid");
  }

  render() {
    return(
      <Provider store={ reduxStore }>
        <BrowserRouter>
          <Fragment>
            <Switch>
              <NeedleRoute
									path={ links["HOME_PAGE"].route }
									condition={ this.cookieID }
									component={ Home }
									redirect={ Login }
									exact
              />
            </Switch>
          </Fragment>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
