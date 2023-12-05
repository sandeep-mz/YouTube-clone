# YouTube UI Clone

## Project Overview

This project replicates the YouTube UI using HTML, CSS, and JavaScript, with two main pages: `index.html` (home page) and `videoDetails.html`. The UI design is based on a Figma design, utilizing the Inter font from Google Fonts.


### Features

- **Search Functionality:** Fetches videos from YouTube's API based on user input.
- **Video Details:** Displays detailed information using YouTube's API.
- **Comments of a Video:** Fetches comments for a selected video.
- **Replies of a Comment:** Loads replies upon user request.

### Pages

- `index.html`: Landing page displaying video items and search bar functionality.
- `videoDetails.html`: Displays video details, including video content, statistics, and comments.

### API Integration

- **Google API:** Utilizes the YouTube Data API v3.
  - [Google API Documentation](https://developers.google.com/youtube/v3)

### UI Design

The UI replicates the Figma design using HTML and CSS. Videos are rendered dynamically based on fetched data.

### Implementation

- **Fetch 20 Videos:** On landing the home page, 20 videos are fetched for an empty search string.
- **Rendering Videos:** JavaScript function renders video objects onto the UI.
- **Navigation:** Clicking on a video item navigates to the video details page, sharing the video ID using storage (localStorage, sessionStorage, or cookies).

### Relevant Links

- [Figma Design Link](https://www.figma.com/file/53msLWP0JcqWdt4n0fjAZu/YouTube-UI-Clone-Design-(Community)?type=design&node-id=3-185&mode=design&t=9E1wUw956BSodnIp-0)
- [Google API Reference](https://www.googleapis.com/youtube/v3)

### APIs Used

- **Search API Documentation:** [Search API](https://developers.google.com/youtube/v3/docs/search/list)
- **Video List API Documentation:** [Video List API](https://developers.google.com/youtube/v3/docs/videos/list)



