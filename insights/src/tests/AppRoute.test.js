import AppRoute from "../routes/AppRoute";


 /**
  * Testing AppRoute.
  */
  test('AppRoute', () => {
    expect(AppRoute).not.toBeUndefined();
    expect(AppRoute).not.toBeNull();
    expect(AppRoute).not.toBe(null);
  });