import React, { Component } from 'react';
import './main.css';

import client from '../../apollo';
import { cookieControl } from '../../utils';
import links from '../../links';

import backgroundVID from './assets/background.mp4';
import { gql } from 'apollo-boost';

class Background extends Component {
    render() {
        return(
            <video autoPlay muted loop className="rn-login-background">
                <source src={ backgroundVID } type="video/mp4" />
                Please, update your browser
            </video> 
        );
    }
}

class TextInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inFocus: false
        }
    }
    
    setFocus = inFocus => this.setState({ inFocus });

    render() {
        return(
            <div className="rn-login-forms-item-txtinp">
                <span className="rn-login-forms-item-txtinp-title">{ this.props.tTitle }</span>
                <div className="rn-login-forms-item-txtinp-mat">
                    <input
                        className="definp"
                        type={ this.props._type }
                        title={ this.props._title }
                        placeholder={ this.props._placeholder }
                        required={ this.props._required || true }
                        onBlur={ () => this.setFocus(false) }
                        onFocus={ () => this.setFocus(true) }
                        onChange={ ({ target }) => this.props._onChange(target) }
                    />
                    <div className={ (typeof this.props.valid === "boolean") ? "focus" : "" }>
                        <div key={ (this.props.valid) ? "A" : "B" }>
                            {
                                (this.props.valid) ? (
                                    <i className="fas fa-check" />
                                ) : (typeof this.props.valid === "boolean") ? (
                                    <i className="fas fa-times" />
                                ) : null
                            }
                        </div>
                    </div>
                </div>
                <div className={ `rn-login-forms-item-txtinp-underline${ (!this.state.inFocus) ? "" : " active" }${ (!this.props.isFetching) ? "" : " fetching" }${ (!this.props.criticalFail) ? "" : " failed" }` } />
            </div>
        );
    }
}

class Stage extends Component {
    constructor(props) {
        super(props);

        // This section isn't important
        switch(this.props.stageName) {
            case 'LOGIN_TYPE':
                this.dataState = {
                    login: "",
                    password: ""
                }
            break;
            case 'REGISTER_TYPE':
                this.dataState = {
                    login: "",
                    password: "",
                    isValidLogin: null
                }
            break;
            default:break;
        }

        this.state = {
            ...this.dataState,
            isFetching: false
        }
    }

    submit = e => {
        e.preventDefault();

        switch(this.props.stageName) {
            case 'LOGIN_STAGE':
            case 'REGISTER_STAGE': {
                if(this.state.isValidLogin === false || this.state.isFetching) break;

                const a = {},
                      { login, password } = this.state;

                a.login = login;
                a.password = password;

                this.props._onSubmit(a);
            } break;
            default:break;
        }
        // 1. Pack values into object
        // 2. Clear all fields
        // 3. Send object

        // this.props._onSubmit();
    }

    render() {
        switch(this.props.stageName) {
            case 'LOGIN_STAGE':
                return(
                    <div className={ `rn-login-forms-item rn-login-forms-login${ (this.props.stageName !== this.props.currentStage) ? "" : " active" }` }>
                        <h2 className="rn-login-forms-item-title">Welcome back</h2>
                        <p className="rn-login-forms-item-slug">Sign in to continue</p>
                        <form className="rn-login-forms-item-in" onSubmit={ this.submit }>
                            <TextInput
                                tTitle="Email or login"
                                _placeholder="steplton_stats@inc.com"
                                _type="text"
                                _title="Type your email or login"
                                _required={ true }
                                criticalFail={ this.props.failed }
                                isFetching={ this.state.isFetching || this.props.isLoading }
                                _onChange={ ({ value }) => this.setState({ login: value }) }
                            />
                            <TextInput
                                tTitle="Password"
                                _placeholder=""
                                _type="password"
                                _title="Type your password"
                                criticalFail={ this.props.failed }
                                isFetching={ this.props.isLoading }
                                _required={ true }
                                _onChange={ ({ value }) => this.setState({ password: value }) }
                            />
                            <button type="submit" title="Press to login" className="definp rn-login-forms-item-submit">
                                Login
                            </button>
                        </form>
                        <button className="definp rn-login-forms-item-agrigation" onClick={ () => this.props.applyStage("REGISTER_STAGE") }>
                            If don't have an account yet you can
                            <span>register</span>
                        </button>
                    </div>
                );
            case 'REGISTER_STAGE':
                return(
                    <div className={ `rn-login-forms-item rn-login-forms-login${ (this.props.stageName !== this.props.currentStage) ? "" : " active" }` }>
                        <h2 className="rn-login-forms-item-title">Register</h2>
                        <p className="rn-login-forms-item-slug">Only two fields to fill to start using <span>MyHealth</span></p>
                        <form className="rn-login-forms-item-in" onSubmit={ this.submit }>
                            <TextInput
                                tTitle="Login"
                                _placeholder="cicada33_data"
                                _type="text"
                                _title="Type your login"
                                _required={ true }
                                valid={ this.state.isValidLogin }
                                criticalFail={ this.props.failed }
                                isFetching={ this.state.isFetching || this.props.isLoading }
                                _onChange={ target => {
                                    this.setState({ login: target.value });

                                    clearTimeout(target.validateInt);

                                    if(!target.value.replace(/\s|\n/g, "").length) { // if empty
                                        this.setState(() => ({
                                            isValidLogin: null
                                        }))
                                    
                                        return; // break function
                                    }

                                    target.validateInt = setTimeout(() => {
                                        this.setState(() => ({
                                            isFetching: true
                                        }));

                                        client.query({
                                            query: gql`
                                                query($login: String!) {
                                                    validateUserLogin(login: $login)
                                                }
                                            `,
                                            variables: {
                                                login: target.value
                                            }
                                        }).then(({ data: { validateUserLogin: a } }) => {
                                            this.setState(() => ({
                                                isFetching: false,
                                                isValidLogin: (target.value.replace(/\s|\n/g, "").length) ? !a : ""
                                            }));
                                        });
                                    }, 250);
                                } }
                            />
                            <TextInput
                                tTitle="Password"
                                _placeholder=""
                                _type="password"
                                _title="Type your password"
                                _required={ true }
                                _onChange={ ({ value }) => this.setState({ password: value }) }
                                isFetching={ this.state.isFetching || this.props.isLoading }
                                criticalFail={ this.props.failed }
                            />
                            <button type="submit" title="Press to login" className="definp rn-login-forms-item-submit">
                                Register
                            </button>
                        </form>
                        <button className="definp rn-login-forms-item-agrigation" onClick={ () => this.props.applyStage("LOGIN_STAGE") }>
                            If you already have an account you can
                            <span>log in</span>
                        </button>
                    </div>
                );
            default:break;
        }
    }
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stage: "LOGIN_STAGE",
            loginFailed: false,
            registerFailed: false,
            loginFetching: false,
            registerFetching: false
        }
    }

    loginUser = ({ login, password }) => {
        if(
            !login.replace(/\s|\n/g, "").length ||
            !password.replace(/\s|\n/g, "").length
        ) return;

        let a = err => this.setState(() => ({
            loginFailed: true
        }), () => console.error(err));

        this.setState(() => ({
            loginFailed: false,
            loginFetching: true
        }));

        client.mutate({
            mutation: gql`
                mutation($login: String!, $password: String!) {
                    loginUser(login: $login, password: $password) {
                        id
                    }
                }
            `,
            variables: {
                login, password
            }
        }).then(({ data: { loginUser: b } }) => {
            if(!b) {
                this.setState(() => ({
                    loginFetching: false
                }));
                return a("Internal unexpected error, probably invalid login or password.");
            }

            cookieControl.set("userid", b.id, 60);
            window.location.href = links["HOME_PAGE"].absolute;
        }).catch(a);
    }

    registerUser = ({ login, password }) => {
        if(
            !login.replace(/\s|\n/g, "").length ||
            !password.replace(/\s|\n/g, "").length
        ) return;
        
        let a = err => this.setState(() => ({
            registerFailed: true
        }), () => console.error(err));

        this.setState(() => ({
            registerFailed: false,
            registerFetching: true
        }));

        client.mutate({
            mutation: gql`
                mutation($login: String!, $password: String!) {
                    registerUser(login: $login, password: $password) {
                        id
                    }
                }
            `,
            variables: {
                login,
                password
            }
        }).then(({ data: { registerUser: b } }) => {
            if(!b) {
                this.setState(() => ({
                    registerFetching: false
                }));
                return a("Internal unexpected error.");
            }

            cookieControl.set("userid", b.id, 60);
            window.location.href = links["HOME_PAGE"].absolute;
        }).catch(a);
    }

    render() {
        return(
            <div className="rn rn-login">
                <section className="rn rn-login-slide">
                    <div>
                        <Background />
                    </div>
                </section>
                <section className="rn rn-login-forms">
                    <Stage
                        stageName="LOGIN_STAGE"
                        _onSubmit={ this.loginUser }
                        applyStage={ stage => this.setState({ stage }) }
                        currentStage={ this.state.stage }
                        isLoading={ this.state.loginFetching }
                        failed={ this.state.loginFailed }
                    />
                    <Stage
                        stageName="REGISTER_STAGE"
                        _onSubmit={ this.registerUser }
                        applyStage={ stage => this.setState({ stage }) }
                        currentStage={ this.state.stage }
                        isLoading={ this.state.registerFetching }
                        failed={ this.state.registerFailed }
                    />
                </section>
            </div>
        );
    }
}

export default App;