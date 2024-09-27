import Component from '@glimmer/component';
import { action } from '@ember/object';
import { assert } from '@ember/debug';

export default class SelectComponent extends Component {
  constructor(owner, args) {
    super(owner, args);

    assert(
      `"SelectComponent" expects \`@onChange\` to be a function. \`${typeof args.onChange}\` was passed.`,
      typeof args.onChange === 'function'
    );
  }

  @action
  handleChange(event) {
    this.args.onChange(event.target.value);
  }
}
