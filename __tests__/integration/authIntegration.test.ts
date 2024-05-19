import { MongoMemoryServer } from "mongodb-memory-server";
import { dbT } from "../../src/db/mongo-.db";
import { authService } from "../../src/services/auth-service";
import { emailAdapter } from "../../src/adapter/emailAdapter";
import { testSeder } from "../utilitTest/testSede";

describe("Auth-integration", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await dbT.run(mongoServer.getUri());
  });
  beforeEach(async () => {
    await dbT.drop();
  });
  afterAll(async () => {
    await dbT.drop();
    await dbT.stop();
  });

  describe("USER-REGISTRITION", () => {
    const registerUserUseCase = authService.creatUser.bind(authService);

    emailAdapter.sendEmail = jest.fn().mockImplementation((userCode: string, email: string) => {
      return true;
    });

    it("registration correct", async () => {
      const userDto = testSeder.creatUserDto();

      const result = await registerUserUseCase(userDto);

      expect(result).toEqual({
        id: expect.any(String),
        login: userDto.login,
        createdAt: expect.any(String),
        email: userDto.email,
      });

      expect(emailAdapter.sendEmail).toHaveBeenCalled();
      expect(emailAdapter.sendEmail).toHaveBeenCalledTimes(1);
    });
    it("should not register user twice", async () => {
      const userDto = testSeder.creatUserDto();
      await testSeder.registerUser(userDto);

      const result = await registerUserUseCase(userDto);
   
    });
  });
});

//dffsdfs