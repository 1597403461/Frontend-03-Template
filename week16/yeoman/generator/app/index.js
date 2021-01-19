var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option('babel'); // This method adds support for a `--babel` flag
  }

  // yeoman 会顺序执行此 class 中的方法
  method1() {
    console.log(' method1 just run');
  }
  method2() {
    console.log(' method2 just run');
  }
};