import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | loading-spinner', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the loading spinner', async function (assert) {
    await render(hbs`
      <LoadingSpinner />
    `);

    assert.dom('svg').exists('The SVG spinner is rendered');

    assert
      .dom('span')
      .hasText('Loading...', 'The loading message is displayed');
  });
});
