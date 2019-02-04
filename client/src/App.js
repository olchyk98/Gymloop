import React, { Component, Fragment } from 'react';

// Pages
import Home from './pages/home';
import Login from './pages/login';
import FoodStats from './pages/foodStats';
import Sleep from './pages/sleep';
import Settings from './pages/settingsp';
import Training from './pages/training';

// Stuff
import { cookieControl } from './utils';
import links from './links';
import Nav from './pages/__forall__/dbar';
import GlobalError from './pages/__forall__/global_error';

// Router
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router'

// Redux
import reducers from './reducers';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const reduxStore = createStore(
  reducers,
  {},
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

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

  componentDidMount() {
    // Detect OS
    {
      let a = "OTHER_OS";
      
      if(navigator.appVersion.indexOf("Mac")) a = "MAC";
      else if(navigator.appVersion.indexOf("Win")) a = "WINDOWS";
      else if(navigator.appVersion.indexOf("Linux")) a = "LINUX";

      reduxStore.dispatch({ type: "SET_WORK_OS", payload: a });
    }
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
              <NeedleRoute
									path={ links["FOOD_STATS_PAGE"].route }
									condition={ this.cookieID }
									component={ FoodStats }
									redirect={ Login }
									exact
              />
              <NeedleRoute
									path={ links["SLEEP_PAGE"].route }
									condition={ this.cookieID }
									component={ Sleep }
									redirect={ Login }
									exact
              />
              <NeedleRoute
									path={ links["SETTINGS_PAGE"].route }
									condition={ this.cookieID }
									component={ Settings }
									redirect={ Login }
									exact
              />
              <NeedleRoute
									path={ links["TRAINING_PAGE"].route }
									condition={ this.cookieID }
									component={ Training }
									redirect={ Login }
									exact
              />
            </Switch>

            {
              (this.cookieID) ? (
                <Nav />
              ) : null
            }

            <GlobalError />
          </Fragment>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
