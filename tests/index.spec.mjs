import gql from 'graphql-tag';
import assert from 'assert';

import PostFragments from './post.fragments.mjs';

import combineFragments from '../src/index.mjs';

const testCombinedDoc = gql`
fragment PostProperties on Post{
  ...PostBaseProperties
  ...PostBodyProperties
  ...PostCommentsProperties
}


fragment PostBaseProperties on Post{
  title
  date
}

fragment PostBodyProperties on Post{
  body
}

fragment PostCommentsProperties on Post{
  comments{
    body
  }
}`;


function getGqlString(doc) {
  return doc.loc && doc.loc.source.body;
}

describe('combineFragments', () => {
  it('should combine fragments with passed array and use model name from first fragment', () =>{
    const resultFragment = combineFragments([PostFragments.BASE, PostFragments.BODY, PostFragments.COMMENTS]);

    assert.equal(getGqlString(resultFragment).trim(), getGqlString(testCombinedDoc).trim());
  });
});