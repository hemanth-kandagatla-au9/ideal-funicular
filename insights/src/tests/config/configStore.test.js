import {APP_STORE_FEATURE_LIST,
    APP_STORE_GROUPS,
    APP_STORE_STATUS,
    APP_LANGUAGE,
    APP_LANGUAGE_COLORS,
    CONSTANT_APPSTORE_SETTINGS,
    APP_STORE_SETTING_OPTIONS,
    APP_GROUP_CONFIGURATION,
    JAVASCRIPT_SERVER_CONFIGURATION,
    EXPORT_APPS_ENV_OPTIONS,} from "../../config/app-store/config"
  
    describe('Constants', () => {
        test('All constant values should be defined', () => {
          expect(APP_STORE_FEATURE_LIST).toBeDefined();
          expect(APP_STORE_GROUPS).toBeDefined();
          expect(APP_STORE_STATUS).toBeDefined();
          expect(APP_LANGUAGE).toBeDefined();
          expect(APP_LANGUAGE_COLORS).toBeDefined();
          expect(CONSTANT_APPSTORE_SETTINGS).toBeDefined();
          expect(APP_STORE_SETTING_OPTIONS).toBeDefined();
          expect(APP_GROUP_CONFIGURATION).toBeDefined();
          expect(JAVASCRIPT_SERVER_CONFIGURATION).toBeDefined();
          expect(EXPORT_APPS_ENV_OPTIONS).toBeDefined();
        });
      
        test('Constant values should not be null or undefined', () => {
          expect(APP_STORE_FEATURE_LIST).not.toBeNull();
          expect(APP_STORE_GROUPS).not.toBeNull();
          expect(APP_STORE_STATUS).not.toBeNull();
          expect(APP_LANGUAGE).not.toBeNull();
          expect(APP_LANGUAGE_COLORS).not.toBeNull();
          expect(CONSTANT_APPSTORE_SETTINGS).not.toBeNull();
          expect(APP_STORE_SETTING_OPTIONS).not.toBeNull();
          expect(APP_GROUP_CONFIGURATION).not.toBeNull();
          expect(JAVASCRIPT_SERVER_CONFIGURATION).not.toBeNull();
          expect(EXPORT_APPS_ENV_OPTIONS).not.toBeNull();
        });
      
        it('Feature list should APP_STORE_FEATURE_LIST values', () => {
          const featureValues = Object.values(APP_STORE_FEATURE_LIST);
          const uniqueValues = new Set(featureValues);

          expect(uniqueValues.size).toEqual(featureValues.length);
        });
      
        it('APP_STORE_STATUS should be unique', () => {

          const statusValues = Object.values(APP_STORE_STATUS);
          const uniqueValues = new Set(statusValues);
          expect(uniqueValues.size).toEqual(statusValues.length);
        });

        it('APP_STORE_SETTING_OPTIONS should have correct label and value pairs', () => {
            expect(APP_STORE_SETTING_OPTIONS).toEqual([
              { label: 'App Group Configuration', value: 'App Group Configuration' },
              { label: 'Javascript Server Configuration', value: 'Javascript Server Configuration' },
            ]);
          });


          it('App group configuration and  server configuration constants should match their values', () => {
            expect(APP_GROUP_CONFIGURATION).toEqual(CONSTANT_APPSTORE_SETTINGS.APPSTORE_GROUP);
            expect(JAVASCRIPT_SERVER_CONFIGURATION).toEqual(CONSTANT_APPSTORE_SETTINGS.APPSTORE_JAVASCRIPT_SERVER);
          });

          it('EXPORT_APPS_ENV_OPTIONS should contain necessary environments', () => {
            const expectedEnvironments = ['predev', 'development', 'qa', 'production'];
            const environmentValues = EXPORT_APPS_ENV_OPTIONS.map(option => option.value);
            expect(environmentValues).toEqual(expect.arrayContaining(expectedEnvironments));
          });


          it('Export apps environment options should have label and value defined', () => {
            EXPORT_APPS_ENV_OPTIONS.forEach(option => {
              expect(option.label).toBeDefined();
              expect(option.value).toBeDefined();
            });
          });

      });