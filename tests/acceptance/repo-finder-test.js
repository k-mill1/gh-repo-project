import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import {
  visit,
  fillIn,
  click,
  triggerEvent,
  currentURL,
} from '@ember/test-helpers';
import sinon from 'sinon';

module('Acceptance | repo-finder', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.githubApiService = this.owner.lookup('service:github-api');
  });

  hooks.afterEach(function () {
    sinon.restore();
  });

  test('it renders the repo-finder page', async function (assert) {
    await visit('/');

    assert.strictEqual(
      currentURL(),
      '/repo-finder',
      'Visiting the main application route redirects to repo-finder page'
    );

    assert
      .dom('h2')
      .hasText('GitHub Repository Finder', 'The page title is correct');

    assert.dom('input#org-name').exists('The organisation name input exists');

    assert.dom('input#access-token').exists('The access token input exists');

    assert
      .dom('button')
      .hasText('Find Repositories', 'The find repositories button exists');
  });

  test('it updates organisation name and token, then finds repositories and successfully filters them', async function (assert) {
    assert.expect(5);

    const mockResponse = {
      items: [
        { id: 1, name: 'repo1', language: 'Ruby', private: false },
        { id: 2, name: 'repo2', language: 'JavaScript', private: true },
      ],
    };

    const mockBranchesRepo1 = [
      { name: 'branch1-repo1' },
      { name: 'branch2-repo1' },
    ];

    const mockBranchesRepo2 = [{ name: 'branch1-repo2' }];

    // Mock the getPublicAndPrivateRepos method
    sinon.replace(
      this.githubApiService,
      'getPublicAndPrivateRepos',
      sinon.stub().returns(Promise.resolve(mockResponse))
    );

    // Mock the getBranches method
    sinon.replace(this.githubApiService, 'getBranches', sinon.stub());

    this.githubApiService.getBranches
      .withArgs('testOrg', 'repo1', 'testToken')
      .returns(Promise.resolve(mockBranchesRepo1));

    this.githubApiService.getBranches
      .withArgs('testOrg', 'repo2', 'testToken')
      .returns(Promise.resolve(mockBranchesRepo2));

    // Mock the searchReposByLanguage method
    sinon.replace(this.githubApiService, 'searchReposByLanguage', sinon.stub());

    this.githubApiService.searchReposByLanguage
      .withArgs('testOrg', 'testToken', 'Ruby')
      .returns(
        Promise.resolve({
          items: [{ id: 1, name: 'repo1', language: 'Ruby', private: false }],
        })
      );

    this.githubApiService.searchReposByLanguage
      .withArgs('testOrg', 'testToken', 'JavaScript')
      .returns(
        Promise.resolve({
          items: [
            { id: 2, name: 'repo2', language: 'JavaScript', private: true },
          ],
        })
      );

    await visit('/repo-finder');

    // Fill in the organisation name
    await fillIn('input#org-name', 'testOrg');
    assert
      .dom('input#org-name')
      .hasValue('testOrg', 'The organisation name is updated');

    // Fill in the access token
    await fillIn('input#access-token', 'testToken');
    assert
      .dom('input#access-token')
      .hasValue('testToken', 'The access token is updated');

    // Click the find repositories button
    await click('button');

    let repoItems = this.element.querySelectorAll('[data-test-repo-item]');

    assert.strictEqual(
      repoItems.length,
      2,
      'There are two repo items rendered'
    );

    // Select 'Ruby' from the language filter dropdown
    await fillIn('select#programming-language', 'Ruby');

    await triggerEvent('select#programming-language', 'change');

    repoItems = this.element.querySelectorAll('[data-test-repo-item]');

    // Verify that the correct repo is displayed after filtering
    assert
      .dom(repoItems[0])
      .exists({ count: 1 }, 'One repository card is rendered after filtering');

    assert
      .dom(repoItems[0])
      .hasText(
        'repo1 Public Ruby 2',
        'The filtered repo card displays the correct information'
      );
  });
});
