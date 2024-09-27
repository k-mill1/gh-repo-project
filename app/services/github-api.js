import Service from '@ember/service';

export default class GithubApiService extends Service {
  GITHUB_API_BASE_URL = 'https://api.github.com';
  PER_PAGE = 5;

  async getPublicAndPrivateRepos(orgName, token) {
    const url = `${
      this.GITHUB_API_BASE_URL
    }/search/repositories?q=org:${encodeURIComponent(
      orgName
    )} is:public is:private&per_page=${encodeURIComponent(this.PER_PAGE)}`;

    return await this.performQuery(url, token);
  }

  async searchReposByLanguage(orgName, token, language) {
    const url = `${
      this.GITHUB_API_BASE_URL
    }/search/repositories?q=org:${encodeURIComponent(
      orgName
    )} language:${encodeURIComponent(language)}&per_page=${this.PER_PAGE}`;

    return await this.performQuery(url, token);
  }

  async getBranches(orgName, repoName, token) {
    const url = `${this.GITHUB_API_BASE_URL}/repos/${encodeURIComponent(
      orgName
    )}/${encodeURIComponent(repoName)}/branches`;

    return await this.performQuery(url, token);
  }

  async performQuery(url, token) {
    const headers = {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    try {
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(error);

      throw new Error('Failed to fetch');
    }
  }
}
