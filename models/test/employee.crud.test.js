const Employee = require('../employee.module');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

describe('Employee', () => {

  before(async () => {

    try {
      const fakeDB = new MongoMemoryServer();
      const uri = await fakeDB.getConnectionString();
      mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (err) {
      console.log(err);
    }
  });

  describe('Reading data', () => {
    before(async () => {
      const testEmpOne = new Employee({ firstName: 'Employee 1', lastName: 'Last', department: 'Department #1' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'Employee 2', lastName: 'Emp', department: 'Department #2' });
      await testEmpTwo.save();

      const testEmpThree = new Employee({ firstName: 'Employee 3', lastName: 'Doe', department: 'Department #3' });
      await testEmpThree.save();
    });

    it('should return all data with "find" method', async () => {
      const employee = await Employee.find();
      const expectedLength = 3;
      expect(employee.length).to.be.equal(expectedLength);
    });
    
    after(async () => {
      await Employee.deleteMany();
    });
  });
});