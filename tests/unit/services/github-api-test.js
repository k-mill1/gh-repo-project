import { module, test } from 'qunit';
import { setupTest } from 'gh-repo-project/tests/helpers';
import sinon from 'sinon';

module('Unit | Service | github-api', function (hooks) {
  setupTest(hooks);

  function mockApiResponse(body = []) {
    const mockResponse = new window.Response(JSON.stringify(body), {
      //the fetch API returns a resolved window Response object
      status: 200,
      headers: {
        'Content-type': 'application/json',
      },
    });

    return Promise.resolve(mockResponse);
  }

  hooks.beforeEach(function () {
    this.githubApiService = this.owner.lookup('service:github-api');
  });

  hooks.afterEach(function () {
    sinon.restore();
  });

  test('getPublicAndPrivateRepos fetches repositories for a given organisation', async function (assert) {
    const mockResponse = [
      { id: 1, name: 'repo1' },
      { id: 2, name: 'repo2' },
    ];
    const orgName = 'emberjs';
    const token = 'fake-token';

    const fetchStub = sinon.stub(window, 'fetch');

    fetchStub.returns(mockApiResponse(mockResponse));

    const repos = await this.githubApiService.getPublicAndPrivateRepos(
      orgName,
      token
    );

    assert.ok(fetchStub.calledOnce, 'Fetch should be called once');

    const [url, options] = fetchStub.getCall(0).args;

    assert.strictEqual(
      url,
      `https://api.github.com/search/repositories?q=org:${orgName} is:public is:private&per_page=25`,
      'Fetch should be called with the correct URL'
    );

    assert.deepEqual(
      options.headers,
      {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      'Fetch should be called with the correct headers'
    );

    assert.ok(Array.isArray(repos), 'Response should be an array');

    assert.strictEqual(repos.length, 2, 'Should fetch two repositories');

    assert.strictEqual(
      repos[0].name,
      'repo1',
      'First repository name should be repo1'
    );

    assert.strictEqual(
      repos[1].name,
      'repo2',
      'Second repository name should be repo2'
    );
  });

  test('searchReposByLanguage fetches repositories for a given organisation and language', async function (assert) {
    const mockResponse = {
      items: [{ id: 1, name: 'repo1', language: 'JavaScript' }],
    };
    const orgName = 'emberjs';
    const token = 'fake-token';
    const language = 'JavaScript';

    const fetchStub = sinon.stub(window, 'fetch');

    fetchStub.returns(mockApiResponse(mockResponse));

    const repos = await this.githubApiService.searchReposByLanguage(
      orgName,
      token,
      language
    );

    assert.ok(
      fetchStub.calledOnce,
      'Fetch should be called once for language search'
    );

    const [url, options] = fetchStub.getCall(0).args;

    assert.strictEqual(
      url,
      `https://api.github.com/search/repositories?q=org:${encodeURIComponent(
        orgName
      )} language:${encodeURIComponent(language)}&per_page=25`,
      'Fetch should be called with the correct URL for language search'
    );

    assert.deepEqual(
      options.headers,
      {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      'Fetch should be called with the correct headers for language search'
    );

    assert.ok(Array.isArray(repos.items), 'Response should be an array');

    assert.strictEqual(repos.items.length, 1, 'Should fetch two repositories');

    assert.strictEqual(
      repos.items[0].name,
      'repo1',
      'First repository name should be repo1'
    );
  });

  test('getBranches fetches branches for a given repository', async function (assert) {
    const mockResponse = [{ name: 'main' }, { name: 'develop' }];
    const orgName = 'emberjs';
    const repoName = 'repo1';
    const token = 'fake-token';

    const fetchStub = sinon.stub(window, 'fetch');

    fetchStub.returns(mockApiResponse(mockResponse));

    const branches = await this.githubApiService.getBranches(
      orgName,
      repoName,
      token
    );

    assert.ok(fetchStub.calledOnce, 'Fetch should be called once for branches');

    const [url, options] = fetchStub.getCall(0).args;

    assert.strictEqual(
      url,
      `https://api.github.com/repos/${orgName}/${repoName}/branches`,
      'Fetch should be called with the correct URL for branches'
    );

    assert.deepEqual(
      options.headers,
      {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      'Fetch should be called with the correct headers for branches'
    );

    assert.ok(Array.isArray(branches), 'Response should be an array');

    assert.strictEqual(branches.length, 2, 'Should fetch two branches');

    assert.strictEqual(
      branches[0].name,
      'main',
      'First branch name should be main'
    );

    assert.strictEqual(
      branches[1].name,
      'develop',
      'Second branch name should be develop'
    );
  });

  test('performQuery handles fetch errors', async function (assert) {
    const orgName = 'emberjs';
    const token = 'fake-token';

    const fetchStub = sinon.stub(window, 'fetch');

    fetchStub.returns(Promise.reject(new Error('Network Error')));

    assert.expect(2);

    await assert.rejects(
      this.githubApiService.getPublicAndPrivateRepos(orgName, token),
      (error) => {
        assert.strictEqual(
          error.message,
          'Network Error',
          'Should throw a fetch error with the correct message'
        );

        return true;
      }
    );
  });
});
