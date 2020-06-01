const Employee = require('../employee.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

describe('Employee', () => {

  before(async () => {

    try {
      const fakeDB = new MongoMemoryServer();
      const uri = await fakeDB.getConnectionString();
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
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
      const emp= await Employee.find();
      const expectedLength = 3;
      expect(emp.length).to.be.equal(expectedLength);
    });

    it('should return proper document by "name" with "findOne" method.', async () => {
      const emp = await Employee.findOne({ lastName: 'Last' });
      expect(emp.lastName).to.be.equal('Last');
        
    });
    
    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const emp = new Employee({ firstName: 'Employee 4', lastName: 'middle', department: 'Department #1' });
      await emp.save();
      expect(emp.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'Employee 1', lastName: 'Last', department: 'Department #1' });
      await testEmpOne.save();  

      const testEmpTwo = new Employee({ firstName: 'Employee 2', lastName: 'Emp', department: 'Department #2' });
      await testEmpTwo.save();

      const testEmpThree = new Employee({ firstName: 'Employee 3', lastName: 'Doe', department: 'Department #1' });
      await testEmpThree.save();  
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ department: 'Department #1' }, { $set: { department: '=Department #1=' }});
      const updatedEmployee = await Employee.findOne({ department: '=Department #1=' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const emp = await Employee.findOne({ department: 'Department #1' });
      emp.department = '=Department #1=';
      await emp.save();
    
      const updatedEmployee = await Employee.findOne({ department: '=Department #1=' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { department: 'Updated!' }});
      const emp = await Employee.find({ department: 'Updated!' });
      expect(emp.length).to.be.equal(3);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Removing data', () => { 
    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'Employee 1', lastName: 'Last', department: 'Department #1' });
      await testEmpOne.save();  

      const testEmpTwo = new Employee({ firstName: 'Employee 2', lastName: 'Emp', department: 'Department #2' });
      await testEmpTwo.save();

      const testEmpThree = new Employee({ firstName: 'Employee 3', lastName: 'Doe', department: 'Department #1' });
      await testEmpThree.save();  
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'Employee 1' });
      const removeEmployee = await Employee.findOne({ firstName: 'Employee 1' });
      expect(removeEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const emp = await Employee.findOne({ firstName: 'Employee 1' });
      await emp.remove();
      const removedEmployee = await Employee.findOne({ firstName: 'Employee 1' });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const removedEmployee = await Employee.find();
      expect(removedEmployee.length).to.be.equal(0);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });
});