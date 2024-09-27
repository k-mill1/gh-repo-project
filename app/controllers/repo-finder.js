import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';

export default class RepoFinderController extends Controller {
  @service githubApi;

  @tracked
  orgName = '';

  @tracked
  token = '';

  @tracked
  usedLanguages = [];

  @tracked
  selectedLanguage = '';

  @tracked
  repositories = [];

  @action
  updateOrgName(event) {
    this.orgName = event.target.value;
  }

  @action
  updateToken(event) {
    this.token = event.target.value;
  }

  @dropTask
  *filterByLanguage(event) {
    this.selectedLanguage = event.target.value;

    try {
      const results = yield this.githubApi.searchReposByLanguage(
        this.orgName,
        this.token,
        this.selectedLanguage
      );

      const repos = results.items;

      if (repos.length) {
        for (let repo of repos) {
          const branches = yield this.githubApi.getBranches(
            this.orgName,
            repo.name,
            this.token
          );
          repo.branches = branches;
          repo.branchesCount = branches.length;
          repo.showBranches = false;
        }
      }

      this.repositories = repos;
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  @dropTask
  *fetchData() {
    try {
      const results = yield this.githubApi.getPublicAndPrivateRepos(
        this.orgName,
        this.token
      );

      const repos = results.items;

      if (repos.length) {
        for (let repo of repos) {
          const branches = yield this.githubApi.getBranches(
            this.orgName,
            repo.name,
            this.token
          );
          repo.branches = branches;
          repo.branchesCount = branches.length;
          repo.showBranches = false;

          const primaryRepoLanguage = repo.language;

          if (
            primaryRepoLanguage &&
            !this.usedLanguages.includes(primaryRepoLanguage)
          ) {
            this.usedLanguages.push(primaryRepoLanguage);
          }
        }
      }

      this.repositories = repos;
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }
}
