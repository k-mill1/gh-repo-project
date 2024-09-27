import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

module('Unit | Controller | repo-finder', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.githubApiService = this.owner.lookup('service:githubApi');
    this.controller = this.owner.lookup('controller:repo-finder');
  });

  test('it updates organisationName correctly', function (assert) {
    // Create a mock input element
    const mockInputElement = document.createElement('input');
    mockInputElement.value = 'testOrg';

    // Pass a mock event with target as the mock input element
    this.controller.updateOrganisationName({ target: mockInputElement });

    assert.strictEqual(
      this.controller.organisationName,
      'testOrg',
      'organisationName is updated correctly'
    );
  });

  test('it updates accessToken correctly', function (assert) {
    // Create a mock input element
    const mockInputElement = document.createElement('input');
    mockInputElement.value = 'testToken';

    // Pass a mock event with target as the mock input element
    this.controller.updateAccessToken({ target: mockInputElement });

    assert.strictEqual(
      this.controller.accessToken,
      'testToken',
      'accessToken is updated correctly'
    );
  });

  test('filterByLanguage: filters repositories by language and updates selectedLanguage and repositories', async function (assert) {
    this.controller.organisationName = 'testOrg';
    this.controller.accessToken = 'testToken';

    const mockRepos = [{ name: 'repo1' }, { name: 'repo2' }];
    const mockBranches = ['branch1', 'branch2'];

    sinon.replace(
      this.githubApiService,
      'searchReposByLanguage',
      sinon.stub().resolves({ items: mockRepos })
    );

    sinon.replace(this.githubApiService, 'getBranches', sinon.stub());

    this.githubApiService.getBranches
      .withArgs('testOrg', 'repo1', 'testToken')
      .resolves(mockBranches);

    this.githubApiService.getBranches
      .withArgs('testOrg', 'repo2', 'testToken')
      .resolves(mockBranches);

    await this.controller.filterByLanguage.perform('JavaScript');

    assert.strictEqual(
      this.controller.selectedLanguage,
      'JavaScript',
      'selectedLanguage is set correctly'
    );

    assert.deepEqual(
      this.controller.repositories,
      mockRepos,
      'repositories are set correctly'
    );

    assert.deepEqual(
      this.controller.repositories[0].branches,
      mockBranches,
      'branches are set correctly for the first repo'
    );
  });

  test('fetchRepositories: fetches data and updates repositories and availableLanguages', async function (assert) {
    this.controller.organisationName = 'testOrg';
    this.controller.accessToken = 'testToken';

    // Mocking the service response
    const mockRepos = [
      { name: 'repo1', language: 'JavaScript' },
      { name: 'repo2', language: 'Ruby' },
    ];
    const mockBranches = ['branch1', 'branch2'];

    sinon.replace(
      this.githubApiService,
      'getPublicAndPrivateRepos',
      sinon.stub().resolves({ items: mockRepos })
    );

    sinon.replace(this.githubApiService, 'getBranches', sinon.stub());

    this.githubApiService.getBranches
      .withArgs('testOrg', 'repo1', 'testToken')
      .resolves(mockBranches);

    this.githubApiService.getBranches
      .withArgs('testOrg', 'repo2', 'testToken')
      .resolves(mockBranches);

    await this.controller.fetchRepositories.perform();

    assert.deepEqual(
      this.controller.repositories,
      mockRepos,
      'repositories are set correctly'
    );

    assert.deepEqual(
      this.controller.availableLanguages,
      ['JavaScript', 'Ruby'],
      'availableLanguages are updated correctly'
    );

    assert.strictEqual(
      this.controller.repositories[0].branchesCount,
      mockBranches.length,
      'branchesCount is set correctly for the first repo'
    );
  });

  test('it handles errors in filterByLanguage', async function (assert) {
    this.controller.organisationName = 'testOrg';
    this.controller.accessToken = 'testToken';

    sinon.replace(
      this.githubApiService,
      'searchReposByLanguage',
      sinon.stub().rejects(new Error('Error fetching data'))
    );

    await this.controller.filterByLanguage.perform('JavaScript');

    assert.deepEqual(
      this.controller.repositories,
      [],
      'repositories remain empty after error'
    );
  });

  test('it handles errors in fetchRepositories gracefully', async function (assert) {
    this.controller.organisationName = 'testOrg';
    this.controller.accessToken = 'testToken';

    sinon.replace(
      this.githubApiService,
      'getPublicAndPrivateRepos',
      sinon.stub().rejects(new Error('Error fetching data'))
    );

    await this.controller.fetchRepositories.perform();

    assert.deepEqual(
      this.controller.repositories,
      [],
      'repositories remain empty after error'
    );
  });
});
