import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | repo-list', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the list of repositories', async function (assert) {
    const mockRepositories = [
      {
        id: 1,
        name: 'Repo One',
      },
      {
        id: 2,
        name: 'Repo Two',
      },
      {
        id: 3,
        name: 'Repo Three',
      },
    ];

    this.set('repositories', mockRepositories);

    await render(hbs`
      <RepoList 
        @repositories={{this.repositories}}
      />
    `);

    assert.dom('ul').exists('The repository list is rendered.');

    assert
      .dom('li')
      .exists({ count: 3 }, 'Three repository items are rendered.');
  });
});
