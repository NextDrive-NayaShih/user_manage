// dbMock.js
class MockPool {
  constructor() {
    this.connect = jest.fn();
    this.query = jest.fn();
    this.release = jest.fn();
  }
}
export default { Pool: MockPool};
