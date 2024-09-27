import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class RepoListRepoItemComponent extends Component {
  @tracked
  showBranches = false;

  get languageStyle() {
    const hue = this.generateHue(this.args.repo.language);
    return `background-color: hsl(${hue}, 70%, 50%);`;
  }

  @action
  toggleBranches() {
    this.showBranches = !this.showBranches;
  }

  generateHue(value) {
    let hash = 0;

    for (let i = 0; i < value.length; i++) {
      hash = value.charCodeAt(i) + ((hash << 5) - hash);
      hash &= hash;
    }

    return Math.abs(hash % 360);
  }
}
