export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS'
export const AUTHORIZATION = 'Authorization'

// #region Validator
export type Validator = {
    [key: string]: {
        errorMessage: string,
        validator: RegExp
    }
}

const EmailValidator = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
const PasswordValidator = /(?=.*[0-9])(?=.*[!@#$%^&*_+\-\\()\[\]/'",.:?=])[a-zA-Z0-9!@#$%^&*_+\-\\()\[\]/'",.:?=]{8,16}$/
const UsernameValidator = /^[\w.]{3,}/

// #endregion Validator

// #region Login

export const LoginForm = Object.freeze({
    email: {
        validator: EmailValidator,
        errorMessage: 'The email format is invalid!'
    },
    password: {
        validator: PasswordValidator,
        errorMessage: 'The password format is invalid!'
    }
} satisfies Validator)

// #endregion Login

// #region Register

export const RegisterForm = Object.freeze({
    email: {
        errorMessage: 'The email format is invalid',
        validator: EmailValidator
    },
    username: {
        errorMessage: 'The username format is invalid',
        validator: UsernameValidator
    },
    displayName: {
        errorMessage: 'The display name\'s length must be between 3 and 50',
        validator: /^.{3,}/
    },
    password: {
        errorMessage: 'The password format is incorrect',
        validator: PasswordValidator
    },
    passwordRepeat: {
        errorMessage: 'The password repeat format is incorrect',
        validator: PasswordValidator
    },
    termsAccepted: {
        errorMessage: 'You must accept the terms if you want to register',
        validator: /^on$/
    }
} satisfies Validator)

// #endregion Register

// #region Session

export type SessionCookie = {
    id: string
}

// #endregion Session

// #region Tweet

export type ITweet = {
    id: string,
    description: string,
    likes: { id: string }[],
    createdAt: Date,
    modifiedAt: Date,
    _count: {
        comments: number,
        retweets: number,
        likes: number
    },
    Owner: {
        name: string,
        displayName: string,
        profilePicturePath: string,
        createdAt: Date
    }
    originalTweet?: ITweet
}

// #endregion Tweet

// #region Profile

export type ProfileData = {
    profilePicture: string
    name: string
    displayName: string
    id: string
    description: string
    createdAt: Date
}

// #endregion Profile

// #region Comment

export type IComment = {
    id: string,
    text: string,
    createdAt: Date,
    modifiedAt: Date,
    Owner: {
        id: string,
        name: string,
        displayName: string,
        profilePicturePath: string
    },
    _count: {
        likes: number
    }
}

// #endregion Comment