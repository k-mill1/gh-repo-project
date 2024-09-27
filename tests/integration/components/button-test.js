import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | button', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders with the correct label', async function (assert) {
    this.set('label', 'Click Me');
    this.set('handleClick', () => {});

    await render(hbs`
      <Button 
        @label={{this.label}}
        @onClick={{this.handleClick}}
      />
    `);

    assert
      .dom('button')
      .hasText('Click Me', 'The button displays the correct label');
  });

  test('it calls the onClick action when clicked', async function (assert) {
    assert.expect(1);

    this.set('label', 'Click Me');

    this.set('handleClick', () => {
      assert.ok(true, 'The onClick action was called');
    });

    await render(hbs`
      <Button 
        @label={{this.label}}
        @onClick={{this.handleClick}}
      />
    `);

    await click('button');
  });

  test('it shows loading state when onClick is triggered', async function (assert) {
    this.set('label', 'Click Me');

    this.set('handleClick', async () => {
      // Simulate an asynchronous action
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await render(hbs`
      <Button 
        @label={{this.label}}
        @onClick={{this.handleClick}}
      />
    `);

    // Click the button to trigger the loading state
    await click('button');

    // Assert that the loading spinner and text are visible
    assert
      .dom('button')
      .includesText('Loading...', 'Button shows loading text');

    assert.dom('svg').exists('Button shows loading spinner');
  });
});
