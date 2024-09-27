import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | repo-list/repo-item ', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the repository details correctly', async function (assert) {
    const mockRepo = {
      id: 1,
      name: 'Repo One',
      html_url: 'https://github.com/repo1',
      private: false,
      language: 'JavaScript',
      branchesCount: 5,
      branches: [],
    };

    this.set('repo', mockRepo);

    await render(hbs`
      <RepoList::RepoItem 
        @repo={{this.repo}}
      />
    `);

    assert.dom('a').exists('Repository link is rendered.');
    assert
      .dom('a')
      .hasAttribute(
        'href',
        mockRepo.html_url,
        'Link points to the correct URL.'
      );
    assert.dom('a').hasText(mockRepo.name, 'Repository name is rendered.');

    assert.dom('.bg-gray-200').exists('Visibility label is rendered.');
    assert
      .dom('.bg-gray-200')
      .hasText('Public', 'The visibility label shows "Public".');

    assert.dom('.mr-4').exists('Language label is rendered.');
    assert
      .dom('.mr-4')
      .hasText(
        mockRepo.language,
        'The language label shows the correct language.'
      );

    assert.dom('button').exists('Branches count button is rendered.');
    assert
      .dom('button')
      .hasText(
        mockRepo.branchesCount.toString(),
        'Branches count button shows the correct count.'
      );
  });

  test('it toggles branches visibility when the button is clicked', async function (assert) {
    const mockRepo = {
      id: 1,
      name: 'Repo One',
      html_url: 'https://github.com/repo1',
      private: false,
      language: 'JavaScript',
      branchesCount: 5,
      branches: [{ name: 'main' }, { name: 'develop' }],
    };

    this.set('repo', mockRepo);

    await render(hbs`
      <RepoList::RepoItem 
        @repo={{this.repo}}
      />
    `);

    assert.dom('ul').doesNotExist('Branches list is not visible initially.');

    // Click the branches count button to toggle visibility
    await click('button');

    assert.dom('ul').exists('Branches list is visible after button click.');

    // Check that the correct branches are displayed
    assert.dom('ul li').exists({ count: 2 }, 'Two branch items are rendered.');

    assert
      .dom('ul li:nth-of-type(1)')
      .hasText('main', 'The first branch is correctly displayed.');

    assert
      .dom('ul li:nth-of-type(2)')
      .hasText('develop', 'The second branch is correctly displayed.');
  });
});
