import Component from '@glimmer/component';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ButtonComponent extends Component {
  @tracked isLoading = false;

  constructor(owner, args) {
    super(owner, args);

    if (
      typeof args.onClick !== 'undefined' &&
      typeof args.onClick !== 'function'
    ) {
      assert(
        `"Button" expects \`@onClick\` to be a function. \`${typeof args.onClick}\` was passed.`
      );
    }
  }

  @action
  async onClick(event) {
    if (typeof this.args.onClick === 'function') {
      this.isLoading = true;

      await this.args.onClick(event);

      this.isLoading = false;
    }
  }
}
