const fs = require('fs');

function removeComments(string){
  return string.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g,'').trim();
}

const graphqlTypesMap = {
  'string': 'String',
  'boolean': 'Boolean',
  'number': 'Float',
}

const types = fs.readFileSync('src/gatsby-interfaces.d.ts').toString();

const nameRx = /interface I(\w+)Fields {/;
const names = types.split('\n').map(line => line.match(nameRx))
  .filter(Boolean)
  .map(m => m[1])

function getGraphqlLines(typeName) {
  const rx = new RegExp(`I${typeName}Fields {(.*?)} `);
  const typeMatch = types.replace(/\n/g, ' ').match(rx);
  
  const typeFieldsLines = typeMatch[1].split(';').map(x => x.trim());
  const lines = typeFieldsLines.map(lineWithComment => {
    const line = removeComments(lineWithComment);
    if (!line) return undefined;

    const isOptional = /\?:/.test(line) || /\| undefined/.test(line);
    const fieldName = line.match(/\w+/)[0];

    const type = line.match(/:(.*)/)[1]
      .replace('| undefined', '')
      .trim();

    const isArray = /\[\]/g.test(line); // TODO is Array<...> a possible case?

    let graphqlType = graphqlTypesMap[type] ?? type;

    const otherFieldsType = names.find(name => {
      return new RegExp(`I${name}`).test(graphqlType);
    })
    if (otherFieldsType) {
      graphqlType = `Contentful${otherFieldsType}`;
    }

    const finalType = isArray ? `[${graphqlType.replace('[]', '')}]` : graphqlType;

    return `\n\t${
      fieldName
    }: ${
      finalType
    }${
      isOptional ? '' : '!'
    }${
      type === 'number' 
        ? '\t\t# check Float or Int'
        : ''
    }`;
  }).filter(Boolean).join('');

  return `type Contentful${typeName} implements Node {${lines}\n}`;
}

const graphql = names.map(getGraphqlLines).join('\n\n');

fs.writeFileSync('./src/graphql-schema.gql', graphql);