import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class NotificationService extends Service {
  @tracked message = '';

  @tracked isVisible = false;

  show(message) {
    this.message = message;
    this.isVisible = true;

    setTimeout(() => {
      this.isVisible = false;
      this.message = '';
    }, 10000); // Display for 10 seconds
  }
}
