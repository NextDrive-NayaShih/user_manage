const adminController = require('../controllers/adminController');
const AdminsModel = require('../models/admins.model');

describe('Admin Controller', () => {
  describe('signup', () => {
    let insertMock = null;

    beforeAll(()=>{
      insertMock = jest.spyOn(AdminsModel, "insert");
    })
    it('should create a new admin', async () => {
      const req = { body: { username: 'testuser', password: 'testpassword' } };
      const res = { json: jest.fn() };
      const id = 1;
      insertMock.mockResolvedValue(id);
      
      await adminController.signup(req, res);

      expect(res.json).toHaveBeenCalledWith({id})
    });

    // it('should handle errors', async () => {
    //   const req = { body: { username: 'testuser', password: 'testpassword' } };
    //   const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    //   AdminsModel.insert.mockRejectedValueOnce(new Error('Database error'));

    //   await adminController.signup(req, res);

    //   expect(res.status).toHaveBeenCalledWith(500);
    //   expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    // });
  });

  // describe('login', () => {
  //   it('should log in an existing admin', async () => {
  //     const req = { body: { username: 'testuser', password: 'testpassword' } };
  //     const res = { json: jest.fn() };

  //     AdminsModel.login.mockResolvedValueOnce({ success: true, token: 'testtoken' });

  //     await adminController.login(req, res);

  //     expect(res.json).toHaveBeenCalledWith({ success: true, token: 'testtoken' });
  //   });

  //   it('should handle invalid login', async () => {
  //     const req = { body: { username: 'testuser', password: 'testpassword' } };
  //     const res = { json: jest.fn() };

  //     AdminsModel.login.mockResolvedValueOnce({ success: false, message: 'Invalid username or password' });

  //     await adminController.login(req, res);

  //     expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid username or password' });
  //   });

  //   it('should handle errors', async () => {
  //     const req = { body: { username: 'testuser', password: 'testpassword' } };
  //     const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  //     AdminsModel.login.mockRejectedValueOnce(new Error('Database error'));

  //     await adminController.login(req, res);

  //     expect(res.status).toHaveBeenCalledWith(500);
  //     expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  //   });
  // });
});
