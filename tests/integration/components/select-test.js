import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, select, settle } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | select', function (hooks) {
  setupRenderingTest(hooks);

  hooks.afterEach(function () {
    sinon.restore();
  });

  test('it renders with correct options and placeholder', async function (assert) {
    this.set('id', 'example-select');
    this.set('placeholder', 'Choose an option');
    this.set('options', ['Option 1', 'Option 2', 'Option 3']);
    this.set('selected', 'Option 1');
    this.set('onChange', () => {});

    await render(hbs`
      <Select 
        @id={{this.id}}
        @placeholder={{this.placeholder}}
        @options={{this.options}}
        @selected={{this.selected}}
        @onChange={{this.onChange}}
      />
    `);

    assert
      .dom(`#${this.id} option`)
      .exists({ count: 4 }, 'There are 4 options including the placeholder');

    assert
      .dom(`#${this.id} option[value=""]`)
      .hasText(
        'Choose an option',
        'The placeholder option is rendered correctly'
      );

    assert
      .dom(`#${this.id} option[value="Option 1"]`)
      .hasText('Option 1', 'Option 1 is rendered correctly');

    assert.ok(
      this.element.querySelector(`#${this.id} option[value="Option 1"]`)
        .selected,
      'The correct option is selected'
    );

    assert
      .dom(`#${this.id} option[value="Option 2"]`)
      .hasText('Option 2', 'Option 2 is rendered correctly');

    assert
      .dom(`#${this.id} option[value="Option 3"]`)
      .hasText('Option 3', 'Option 3 is rendered correctly');
  });

  test('it calls the onChange action when an option is selected', async function (assert) {
    const onChangeStub = sinon.stub();
    this.set('id', 'example-select');
    this.set('options', ['Option 1', 'Option 2', 'Option 3']);
    this.set('selected', 'Option 1');
    this.set('onChange', onChangeStub);

    await render(hbs`
      <Select 
        @id={{this.id}}
        @options={{this.options}}
        @selected={{this.selected}}
        @onChange={{this.onChange}}
      />
    `);

    // Change the selection
    await select(`#${this.id}`, 'Option 2');

    assert.ok(onChangeStub.calledOnce, 'The onChange action was called once');

    assert.ok(
      onChangeStub.calledWith('Option 2'),
      'The onChange action was called with the correct value'
    );
  });
});
