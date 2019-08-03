import gql from 'graphql-tag';

function combineFragments(fragments) {
  const entity = getTypeName(fragments[0]);

  const getFragmentName = f => f.definitions[0].name.value;

  const fragmentStrings = fragments.map(f => `...${getFragmentName(f)}`).join(`
  `);

  const gqlString = `
    fragment ${entity}Properties on ${entity}{
      ${fragmentStrings}
    }
  `;

  const templateFunc = generateDynamicTemplateFunc(gqlString, fragments);

  return templateFunc(gql, fragments);
}

function getTypeName(fragment){
  return fragment.definitions.find(d => d.kind === 'FragmentDefinition').typeCondition.name.value;
}

function generateDynamicTemplateFunc(fragmentString, fragments) {
  let functionBody = `return gql\`
    ${fragmentString}
    `;
  fragments.forEach((f, i) => {
    functionBody += '${fragments[' + i + ']}';
  });

  functionBody += '`';

  return new Function('gql', 'fragments', functionBody);
}

export default combineFragments;