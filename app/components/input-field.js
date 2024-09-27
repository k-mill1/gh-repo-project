import Component from '@glimmer/component';
import { action } from '@ember/object';
import { assert } from '@ember/debug';

export default class InputFieldComponent extends Component {
  constructor(owner, args) {
    super(owner, args);

    assert(
      `"InputFieldComponent" expects \`@onInput\` to be a function. \`${typeof args.onInput}\` was passed.`,
      typeof args.onInput === 'function'
    );
  }

  @action
  handleInput(event) {
    this.args.onInput(event);
  }
}
