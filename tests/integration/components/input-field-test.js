import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | input-field', function (hooks) {
  setupRenderingTest(hooks);

  hooks.afterEach(function () {
    sinon.restore();
  });

  test('it renders with correct information', async function (assert) {
    this.set('id', 'username');
    this.set('label', 'Username');
    this.set('placeholder', 'Enter your username');
    this.set('type', 'text');
    this.set('onInput', sinon.stub());
    this.set('required', true);

    await render(hbs`
      <InputField 
        @id={{this.id}}
        @label={{this.label}}
        @placeholder={{this.placeholder}}
        @type={{this.type}}
        @required={{this.required}}
        @onInput={{this.onInput}}
      />
    `);

    assert
      .dom(`label[for=${this.id}]`)
      .hasText('Username *', 'The label displays the correct text');

    assert
      .dom(`input#${this.id}`)
      .hasAttribute(
        'placeholder',
        'Enter your username',
        'The input has the correct placeholder'
      )
      .hasAttribute('type', 'text', 'The input has the correct type')
      .hasAttribute('id', 'username', 'The input has the correct id');
  });

  test('it calls the onInput action when input is provided', async function (assert) {
    const inputStub = sinon.stub();

    this.set('id', 'username');
    this.set('label', 'Username');
    this.set('onInput', inputStub);

    await render(hbs`
      <InputField 
        @id={{this.id}}
        @label={{this.label}}
        @onInput={{this.onInput}}
      />
    `);

    await fillIn(`input#${this.id}`, 'testUser');

    assert.ok(inputStub.calledOnce);
  });
});
