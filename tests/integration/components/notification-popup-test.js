import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | notification-popup', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.notificationService = this.owner.lookup('service:notification');
  });

  hooks.afterEach(function () {
    sinon.restore();
  });

  test('it renders the notification when isVisible and message are truthy', async function (assert) {
    sinon.replaceGetter(
      this.notificationService,
      'isVisible',
      sinon.stub().returns(true)
    );

    sinon.replaceGetter(
      this.notificationService,
      'message',
      sinon.stub().returns('Test notification message')
    );

    await render(hbs`
      <NotificationPopup 
        @isVisible={{this.isVisible}}
        @message={{this.message}}
      />
    `);

    assert
      .dom('div')
      .hasText(
        'Test notification message',
        'The notification displays the correct message'
      );
  });

  test('it does not render the notification when not visible', async function (assert) {
    sinon.replaceGetter(
      this.notificationService,
      'isVisible',
      sinon.stub().returns(false)
    );

    sinon.replaceGetter(
      this.notificationService,
      'message',
      sinon.stub().returns('Test notification message')
    );

    await render(hbs`
      <NotificationPopup 
        @isVisible={{this.isVisible}}
        @message={{this.message}}
      />
    `);

    assert
      .dom('div')
      .doesNotExist('The notification is not rendered when not visible');
  });

  test('it does not render the notification when message is empty', async function (assert) {
    sinon.replaceGetter(
      this.notificationService,
      'isVisible',
      sinon.stub().returns(true)
    );

    sinon.replaceGetter(
      this.notificationService,
      'message',
      sinon.stub().returns('')
    );

    await render(hbs`
      <NotificationPopup
        @isVisible={{this.isVisible}}
        @message={{this.message}}
      />
    `);

    assert
      .dom('div')
      .doesNotExist('The notification is not rendered when message is empty');
  });
});
