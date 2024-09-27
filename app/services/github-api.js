import Service from '@ember/service';

export default class GithubApiService extends Service {
  GITHUB_API_BASE_URL = 'https://api.github.com';
  PER_PAGE = 25;

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
        // Attempt to parse JSON, fallback to a generic error if it fails
        const errorDetails = await response.json().catch(() => {
          return { message: 'Unable to parse error response.' };
        });

        const errorMessages = errorDetails.errors
          ? errorDetails.errors.map((err) => err.message).join(', ')
          : errorDetails.message || 'An unknown error occurred';

        throw new Error(errorMessages);
      }

      return await response.json();
    } catch (error) {
      console.error(error);

      throw new Error(error.message);
    }
  }
}
