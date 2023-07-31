module.exports = function (plop) {
  plop.setGenerator('Contentful Component', {
    description: 'Component associated to a Contentful content-type',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name'
      }
    ],
    actions: [
      {
        type: 'add',
        path: '../src/components/{{kebabCase name}}/{{kebabCase name}}.ts',
        templateFile: './templates/component.hbs'
      },
      {
        type: 'add',
        path: '../src/components/{{kebabCase name}}/index.ts',
        template: 'export * from "./{{kebabCase name}}"'
      },
      {
        type: 'add',
        path: '../src/components/{{kebabCase name}}/module.json',
        template: '{\n\t"contentful_id": "{{kebabCase name}}"\n}'
      },
      {
        type: 'add',
        path: '../migrations/oneshot/{{datetime ""}}_create_{{kebabCase name}}.js',
        templateFile: './templates/create_component_migration.hbs'
      }
    ]
  });
};