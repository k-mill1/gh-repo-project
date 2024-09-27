import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | notification', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.notificationService = this.owner.lookup('service:notification');
  });

  test('it shows a notification', async function (assert) {
    // Check initial state
    assert.notOk(
      this.notificationService.isVisible,
      'Notification is not visible initially'
    );

    assert.strictEqual(
      this.notificationService.message,
      '',
      'Notification message is empty initially'
    );

    // Show a notification
    const testMessage = 'Test notification message';

    this.notificationService.show(testMessage);

    // Verify that the notification is visible and message is set
    assert.ok(
      this.notificationService.isVisible,
      'Notification is visible after showing it'
    );

    assert.strictEqual(
      this.notificationService.message,
      testMessage,
      'Notification message is set correctly'
    );
  });
});
