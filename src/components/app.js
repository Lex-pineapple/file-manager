import User from './user.js';

class App {
  constructor() {
    this.user = new User();
  }

  start() {
    this.user.printUsername();
  }
}

export default App;