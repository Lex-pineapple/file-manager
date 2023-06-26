import User from './user.js';
import Input from './input.js';

class App {
  constructor() {
    this.user = new User();
    this.input = new Input();
  }

  start() {
    this.user.printUsername();
    this.input.username = this.user.username;
    this.input.start();
  }
}

export default App;