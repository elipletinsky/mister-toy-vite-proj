import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { login, signup } from '../store/actions/user.actions.js'
import { LoginForm } from './LoginForm.jsx'
import { useState } from 'react'

export function LoginSignup() {

    const [isSignup, setIsSignUp] = useState(false)

    function onLogin(credentials) {
        isSignup ? _signup(credentials) : _login(credentials)
    }

    function _login(credentials) {
        login(credentials)
            .then(() => { showSuccessMsg('Logged in successfully') })
            .catch((err) => { showErrorMsg('Oops try again') })
    }

    function _signup(credentials) {
        signup(credentials)
            .then(() => { showSuccessMsg('Signed in successfully') })
            .catch((err) => { showErrorMsg('Oops try again') })
    }

    function onSignupDemoUsers() {
        userService.signupDemoUsers()
            .then(() => showSuccessMsg('Demo Users Are Signed up!'))
            .catch(() => showErrorMsg('Cannot signup more demo users'))
    }

    return (
        <div className="login-signup">

            <LoginForm
                onLogin={onLogin}
                isSignup={isSignup}
            />
            <div className="btns">
                <a href="#" onClick={() => setIsSignUp(isSignup => !isSignup)}>
                    {isSignup ?
                        'Already a member? Login' :
                        'New user? Signup here'
                    }
                </a >
                {/* <button
                    className='demo-users'
                    style={{ margin: '1em 0' }}
                    onClick={onSignupDemoUsers}
                >
                    Signup Demo Users
                </button> */}
            </div>

        </div >
    )
}
