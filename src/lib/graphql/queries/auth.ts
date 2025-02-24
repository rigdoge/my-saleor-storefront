import { gql } from 'graphql-request'

export const LOGIN_MUTATION = gql`
  mutation TokenAuth($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      token
      refreshToken
      errors {
        field
        message
      }
      user {
        id
        email
        firstName
        lastName
        isActive
      }
    }
  }
`

export const REGISTER_MUTATION = gql`
  mutation RegisterAccount(
    $input: AccountRegisterInput!
  ) {
    accountRegister(
      input: $input
    ) {
      user {
        id
        email
        firstName
        lastName
        isActive
      }
      errors {
        field
        message
        code
      }
    }
  }
`

export const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    me {
      id
      email
      firstName
      lastName
      isActive
    }
  }
` 