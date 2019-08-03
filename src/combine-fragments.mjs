import gql from 'graphql-tag';

function combineFragments(inputParams) {
  if (Array.isArray(inputParams)){
    const fragments = inputParams;
    const entity = getTypeName(fragments[0]);
    return _combineFragments({entity, fragments});
  } else {
    return _combineFragments(inputParams);
  }
}

function _combineFragments({ entity, combinedName, fragments }){
  combinedName = combinedName || `${entity}Properties`;

  const getFragmentName = f => f.definitions[0].name.value;

  const fragmentStrings = fragments.map(f => `...${getFragmentName(f)}`).join(`
  `);

  const gqlString = `
    fragment ${combinedName} on ${entity}{
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