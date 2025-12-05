class RouteStore {
  constructor() {
    this.value = window.location.pathname;
    this.listeners = [];
  }
  
  subscribe(callback) {
    this.listeners.push(callback);
  }
  
  set(path) {
    this.value = path;
    this.listeners.forEach(cb => cb(path));
    window.history.pushState({}, '', path);
  }
}

export const currentRoute = new RouteStore();

export const navigateTo = (path) => {
  currentRoute.set(path);
};
