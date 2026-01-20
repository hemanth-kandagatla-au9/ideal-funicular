const AppConfigModel = require('../../server/models/appConfigModel');
const mongoose = require('mongoose');

describe('AppConfigModel', () => {
  it('should create app config with all fields', () => {
    const configData = {
      appname: 'test-app'
    };

    const config = new AppConfigModel(configData);

    expect(config.appname).toBe('test-app');
  });

  it('should have timestamps', () => {
    const config = new AppConfigModel({ appname: 'test' });
    
    expect(config.schema.path('createdAt')).toBeDefined();
    expect(config.schema.path('updatedAt')).toBeDefined();
  });

  it('should allow optional id field', () => {
    const config = new AppConfigModel({
      id: new mongoose.Types.ObjectId(),
      appname: 'app-with-id'
    });

    expect(config.id).toBeDefined();
    expect(config.appname).toBe('app-with-id');
  });

  it('should work without id field', () => {
    const config = new AppConfigModel({
      appname: 'app-without-id'
    });

    expect(config.appname).toBe('app-without-id');
  });
});
