import gql from 'graphql-tag';

export const BASE = gql`
fragment PostBaseProperties on Post{
  title
  date
}
`;

export const BODY = gql`
fragment PostBodyProperties on Post{
  body
}
`;

export const COMMENTS = gql`
fragment PostCommentsProperties on Post{
  comments{
    body
  }
}
`;

export default {
  BASE,
  BODY,
  COMMENTS
};