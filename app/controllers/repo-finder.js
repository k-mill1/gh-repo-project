import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import { assert } from '@ember/debug';

export default class RepoFinderController extends Controller {
  @service githubApi;

  @service notification;

  @tracked
  organisationName = '';

  @tracked
  accessToken = '';

  @tracked
  availableLanguages = [];

  @tracked
  selectedLanguage = '';

  @tracked
  repositories = [];

  @tracked formErrorMessage = '';

  @action
  updateOrganisationName(event) {
    assert(
      '`event.target` must be HTMLInputEleSment',
      event.target instanceof HTMLInputElement
    );

    this.organisationName = event.target.value;
  }

  @action
  updateAccessToken(event) {
    assert(
      '`event.target` must be HTMLInputEleSment',
      event.target instanceof HTMLInputElement
    );

    this.accessToken = event.target.value;
  }

  @action
  async handleSubmit(event) {
    event.preventDefault();

    if (!this.validateRequiredFields()) {
      return;
    }

    this.fetchRepositories.perform();
  }

  /*
   * Fetches repositories based on the selected language
   */
  @dropTask
  *filterByLanguage(language) {
    this.selectedLanguage = language;

    try {
      const results = yield this.githubApi.searchReposByLanguage(
        this.organisationName,
        this.accessToken,
        this.selectedLanguage
      );

      const repos = results.items;

      if (repos.length) {
        for (let repo of repos) {
          yield* this.fetchAndSetBranchesForRepo(repo);
        }
      }

      this.repositories = repos;
    } catch (error) {
      this.notification.show(error);
    }
  }

  @dropTask
  *fetchRepositories() {
    // Note: The maximum response limit from the GitHub API is 100 repositories,
    // but for performance optimizations, the page limit has been set to 25.
    // This means that the user will only see the first 25 repositories. This is a limitation
    // that needs to be fixed in the future with pagination implementation.

    // Due to this limitation, the language filter may not be fully accurate,
    // as it only reflects the languages present in the first 25 results.
    // This limitation also needs to be fixed in the future to ensure the filter
    // accurately represents all available repositories.

    if (!this.validateRequiredFields()) {
      return;
    }

    try {
      const results = yield this.githubApi.getPublicAndPrivateRepos(
        this.organisationName,
        this.accessToken
      );

      const repos = results.items;

      if (repos.length) {
        for (let repo of repos) {
          yield* this.fetchAndSetBranchesForRepo(repo);

          const primaryRepoLanguage = repo.language;

          if (
            primaryRepoLanguage &&
            !this.availableLanguages.includes(primaryRepoLanguage)
          ) {
            this.availableLanguages.push(primaryRepoLanguage);
          }
        }
      }

      this.selectedLanguage = '';
      this.repositories = repos;
    } catch (error) {
      this.notification.show(error);
    }
  }

  /*
   * Fetches branches for a given repository and updates the repository object with branch details
   */
  *fetchAndSetBranchesForRepo(repo) {
    try {
      const branches = yield this.githubApi.getBranches(
        this.organisationName,
        repo.name,
        this.accessToken
      );

      repo.branches = branches;
      repo.branchesCount = branches.length;
    } catch (error) {
      throw Error(`Failed to fetch branches for repo ${repo.name}`);
    }
  }

  /*
   * Validates required fields and sets an error message if any fields are empty
   */
  validateRequiredFields() {
    if (!this.organisationName || !this.accessToken) {
      this.formErrorMessage = 'Please fill in all required fields.';

      return false;
    }

    this.formErrorMessage = '';

    return true;
  }
}
