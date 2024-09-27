import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | error-message', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the error message when provided', async function (assert) {
    this.set('errorMessage', 'This is an error message');

    await render(hbs`
      <ErrorMessage 
        @message={{this.errorMessage}}
      />
    `);

    assert
      .dom('p')
      .hasText(
        'This is an error message',
        'The correct error message is displayed'
      );
  });

  test('it does not render anything when no message is provided', async function (assert) {
    await render(hbs`
      <ErrorMessage 
        @message={{this.errorMessage}}
      />
    `);

    assert
      .dom('p')
      .doesNotExist('No paragraph is rendered when there is no message');
  });
});
