import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class NotificationPopupComponent extends Component {
  @service notification;

  get isVisible() {
    return this.notification.isVisible;
  }

  get message() {
    return this.notification.message;
  }
}
