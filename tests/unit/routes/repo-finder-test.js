import { module, test } from 'qunit';
import { setupTest } from 'gh-repo-project/tests/helpers';

module('Unit | Route | repo-finder', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:repo-finder');
    assert.ok(route);
  });
});
