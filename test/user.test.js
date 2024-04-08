import userController from '../controllers/userController.js';
import UsersModel from '../models/users.model.js';

describe('User Controller', () => {
    describe('getAllUsers', () => {
        let selectAllMock = null;
        let res;
        beforeAll(() => {
            // 監視特定函式的調用情況，並指定它的返回值
            selectAllMock = jest.spyOn(UsersModel, "selectAll");
            res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        })
        it('should return all users', async () => {

            const mockUsers = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];
            selectAllMock.mockResolvedValue({ rows: mockUsers });

            const result = await userController.getAllUsers(null, res);
            console.log(res.status);

            expect(result).toEqual(mockUsers);
            expect(res.status).toHaveBeenCalledWith(200)
        });

        it('should return an empty array when there are no users in the database', async () => {
            selectAllMock.mockResolvedValue({ rows: [] });

            const result = await userController.getAllUsers(null, res);

            expect(result).toEqual([]);
            expect(res.status).toHaveBeenCalledWith(200)
        });

        it('should handle database errors and return an error message', async () => {
            const errorMessage = 'Database error';
            selectAllMock.mockRejectedValue(new Error(errorMessage));

            await userController.getAllUsers(null, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });

        });
    });

    // describe('getUserById', () => {
    //     let req;
    //     let res;
      
    //     beforeEach(() => {
    //       selectByIdMock = jest.spyOn(UsersModel, "selectById");
    //       req = { params: { id: '1' } };
    //       res = {
    //         json: jest.fn(),
    //         status: jest.fn().mockReturnThis() // Mock the status method
    //       };
    //     });
        
    //     it('should return user data when user exists', async () => {
    //       const mockUser = { id: 1, name: 'John Doe' };
    //       // Mock the selectById method of UsersModel to resolve with user data
    //       selectByIdMock.mockResolvedValue({ rows: mockUser })
      
    //       await userController.getUserById(req, res);
            
    //       expect(res.status).not.toHaveBeenCalled();
    //       expect(res.json).toHaveBeenCalledWith(mockUser);
    //     });
      
    //   });

    describe('addUser', () => {
        let insertMock;
        let req;
        let res;

        beforeAll(() => {
            insertMock = jest.spyOn(UsersModel, 'insert');
            req = { body: { name: 'Test User', nickname: 'testuser', age: 25 } };
            res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis() // Mock the status method
            };
        });

        it('should add a new user and return the user ID', async () => {
            const mockUserId = 1;
            const mockResult = { rows: [{ id: mockUserId }] };
            insertMock.mockResolvedValueOnce(mockResult);

            await userController.addUser(req, res);

            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ id: mockUserId });
        });

        it('should return 500 for database errors', async () => {
            const errorMessage = 'Database error';
            insertMock.mockRejectedValueOnce(new Error(errorMessage));

            await userController.addUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });

});
