
import reportWebVitals from '../reportWebVitals';
jest.mock("web-vitals", () => ({
  ...jest.requireActual("web-vitals"),
  getCLS:jest.fn(),
  getFID:jest.fn(),
  getFCP:jest.fn(),
  getLCP:jest.fn(),
  getTTFB:jest.fn(),
}));
// eslint-disable-next-line @typescript-eslint/no-empty-function
const onPerfEntry=()=>{};
test('should be called', () => {
  reportWebVitals(onPerfEntry)
});


