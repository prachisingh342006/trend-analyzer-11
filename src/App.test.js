import { render, screen } from '@testing-library/react';
import App from './App';

const mockCsv = `Post_ID,Post_Date,Platform,Hashtag,Content_Type,Region,Views,Likes,Shares,Comments,Engagement_Level
Post_1,2023-01-13,TikTok,#Challenge,Video,UK,4163464,339431,53135,19346,High
Post_2,2023-05-13,Instagram,#Education,Shorts,India,4155940,215240,65860,27239,Medium
Post_3,2023-07-09,Twitter,#Dance,Tweet,USA,294870,213142,20351,20767,Low
Post_4,2023-11-08,YouTube,#Fitness,Live Stream,Japan,1633015,312907,45774,30725,High`;

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      text: () => Promise.resolve(mockCsv)
    })
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders the dataset dashboard with AI and research sections', async () => {
  render(<App />);

  expect(screen.getByText(/loading historical trend data/i)).toBeInTheDocument();

  expect(
    await screen.findByRole('heading', { name: /ai model and dataset analysis dashboard/i })
  ).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /ai model analysis/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /research paper library/i })).toBeInTheDocument();
  expect(screen.getAllByText(/research paper/i).length).toBeGreaterThan(0);
});
