const adminController = require('../controllers/adminController');
const AdminsModel = require('../models/admins.model');

describe('Admin Controller', () => {
  describe('signup', () => {
    let insertMock = null;

    beforeAll(()=>{
      // 監視特定函式的調用情況，並指定它的返回值
      insertMock = jest.spyOn(AdminsModel, "insert");
    })
    it('should create a new admin', async () => {
      const req = { body: { username: 'testuser', password: 'testpassword' } };
      const res = { json: jest.fn() };
      const id = 1;
      // 指定了當 AdminsModel.insert 函式被調用時應該返回的值是 id
      insertMock.mockResolvedValue(id); 
      
      await adminController.signup(req, res);
      
      expect(res.json).toHaveBeenCalledWith({id})
    });
  });

  describe('login', () => {
    let loginMock = null;

    beforeAll(()=>{
      loginMock = jest.spyOn(AdminsModel, "login");
    })
    it('should login an admin with valid username and password', async () => {
      const req = { body: { username: 'testuser', password: 'testpassword' } };
      const res = { json: jest.fn() };
      const expectedToken = expect.any(String); // Expect any string type for the token
      loginMock.mockResolvedValue({
        rows: [{ username: 'testuser' }],
        token: expectedToken // Add mocked token to the response
      });
      
      await adminController.login(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: expectedToken }));
    });

    it('should return an error message for invalid credentials', async () => {
      const req = { body: { username: 'invaliduser', password: 'invalidpassword' } };
      const res = { json: jest.fn() };
      const expectedErrorMessage = 'Invalid username or password';
      loginMock.mockResolvedValue({
        rows: []
      });
      
      await adminController.login(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: false, message: expectedErrorMessage });
    });
    it('should return an error message for database errors', async () => {
      const req = { body: { username: 'testuser', password: 'testpassword' } };
      const res = { json: jest.fn(), status: jest.fn() };
      const expectedErrorMessage = 'Internal server error';
      loginMock.mockRejectedValue(new Error('Database error'));
      res.status.mockReturnThis();
      
      await adminController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: expectedErrorMessage });
    });
  });
});
