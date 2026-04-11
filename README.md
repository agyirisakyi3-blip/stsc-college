# SUCCESS THEOLOGICAL SEMINARY AND COLLEGE Website

A modern, accessible, production-ready website for SUCCESS THEOLOGICAL SEMINARY AND COLLEGE featuring comprehensive biblical education courses, student applications, and Manus AI integration for intelligent application analysis.

## Design Philosophy

**Modern Spiritual Minimalism** - Clean, contemporary design with spiritual authenticity. The aesthetic combines generous whitespace, refined typography, and soft teal accents to create a professional yet welcoming learning environment.

### Design System

- **Primary Color:** Soft White (#fafaf9)
- **Secondary Color:** Stone Gray (#78716f)
- **Accent Color:** Soft Teal (#4a9b8e)
- **Text Color:** Deep Charcoal (#1f1f1f)
- **Display Font:** Poppins (bold headings)
- **Body Font:** Outfit (readable body text)
- **Accent Font:** Playfair Display (quotes and testimonials)

## Features

### Core Pages

1. **Home** - Hero section with value propositions, featured courses, and testimonials
2. **About** - Mission, vision, core values, faculty bios, and institutional history
3. **Courses** - Course catalog with filtering, detailed course modals, and prerequisites
4. **Contact** - Contact form with validation, contact information, and office hours
5. **Application Portal** - Multi-step application form with file upload and Manus AI analysis
6. **Admin Dashboard** - Application management with AI insights and suggested replies

### Key Features

- **Responsive Design** - Mobile-first approach with breakpoints at 768px and 1024px
- **Accessibility** - WCAG AA compliant with semantic HTML, keyboard navigation, and ARIA labels
- **Form Validation** - Client-side validation with friendly error messages
- **Manus AI Integration** - Automatic application analysis and candidate scoring
- **Data Persistence** - LocalStorage for applications and contact messages (demo mode)
- **Progressive Enhancement** - Works without JavaScript for core functionality

## Project Structure

```
grace-bible-school/
├── client/
│   ├── public/
│   │   ├── favicon.ico
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Courses.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Apply.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   └── NotFound.tsx
│   │   ├── data/
│   │   │   └── courses.json
│   │   ├── lib/
│   │   │   └── manus.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   └── tsconfig.json
├── server/
│   └── index.ts
├── package.json
└── README.md
```

## Setup & Installation

### Prerequisites

- Node.js 18+ and npm/pnpm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Local Development

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start development server:**
   ```bash
   pnpm dev
   ```

3. **Open in browser:**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
pnpm build
```

This creates optimized production files in the `dist/` directory.

## Manus AI Integration

### Overview

The website integrates Manus AI for two key functions:

1. **Course Description Enrichment** - Expand brief course summaries into comprehensive descriptions
2. **Application Analysis** - Analyze applicant data to generate summaries, fit scores, and suggested responses

### Current Implementation

The current implementation uses **demo mode** with mock data. To enable production Manus AI calls, follow the steps below.

### Production Setup

#### Step 1: Create a Serverless Function

Create a serverless endpoint (using Netlify Functions, Vercel, or your own backend) that securely calls Manus AI:

**Example: Netlify Function (`netlify/functions/manus-api.js`)**

```javascript
const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    const apiKey = process.env.MANUS_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    // Call Manus AI API
    const response = await fetch('https://api.manus.im/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Manus API error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

#### Step 2: Configure Environment Variables

Add your Manus API key to your deployment environment:

```bash
# .env (local development)
MANUS_API_KEY=your_api_key_here

# Netlify: Add via Site settings → Build & deploy → Environment
# Vercel: Add via Settings → Environment Variables
```

#### Step 3: Update Manus Integration Module

Edit `client/src/lib/manus.ts` to call your serverless endpoint:

```typescript
// In generateCourseDescription() function:
const response = await fetch('/.netlify/functions/manus-api', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt })
});

const result = await response.json();
return JSON.parse(result.content); // Adjust based on API response format

// In analyzeApplication() function:
const response = await fetch('/.netlify/functions/manus-api', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt })
});

const result = await response.json();
return JSON.parse(result.content);
```

#### Step 4: Disable Demo Mode

In `client/src/lib/manus.ts`, change:

```typescript
export const DEMO_MODE = false; // Enable production mode
```

### API Key Security

**IMPORTANT:** Never commit your API key to version control. Always use environment variables for sensitive credentials.

## Data Management

### Course Data

Courses are stored in `client/src/data/courses.json`. Each course includes:

```json
{
  "id": "001",
  "title": "Course Title",
  "summary": "Brief summary",
  "fullDescription": "Detailed description",
  "level": "Beginner|Intermediate|Advanced",
  "duration": "12 weeks",
  "prerequisites": "None or course name",
  "thumbnail": "image URL",
  "instructor": "Instructor name",
  "capacity": 30,
  "startDate": "2026-05-01",
  "schedule": "Tuesdays & Thursdays, 7:00 PM - 8:30 PM",
  "outcomes": ["Outcome 1", "Outcome 2"]
}
```

### Application Storage

In demo mode, applications are stored in browser localStorage under the key `applications`. Each application includes:

```json
{
  "id": "APP-1234567890",
  "name": "Applicant Name",
  "email": "email@example.com",
  "phone": "(555) 123-4567",
  "courseId": "001",
  "courseTitle": "Course Name",
  "bio": "Applicant bio",
  "education": "Education background",
  "resume": "filename.pdf",
  "aiAnalysis": {
    "summary": "AI-generated summary",
    "score": 85,
    "concerns": ["Concern 1"],
    "suggestedReply": "Email template"
  },
  "submittedAt": "2026-04-10T15:30:00.000Z",
  "status": "Approved|Under Review"
}
```

### Contact Messages

Contact form submissions are stored in localStorage under `contactMessages`.

## Admin Dashboard

Access the admin dashboard at `/admin` with the demo password: `admin123`

Features:
- View all applications with AI analysis
- Filter by approval status
- Export suggested reply emails
- View applicant fit scores
- Delete applications

## Accessibility & SEO

### Accessibility Features

- ✅ Semantic HTML5 elements (main, nav, header, footer, article, section)
- ✅ ARIA labels for form inputs and interactive elements
- ✅ Keyboard navigation support (Tab, Enter, Escape)
- ✅ Focus indicators on all interactive elements
- ✅ Color contrast meets WCAG AA standards
- ✅ Skip-to-content links for keyboard users
- ✅ Form validation with accessible error messages
- ✅ Image alt text for all decorative and informational images

### SEO Optimization

- ✅ Meta descriptions on all pages
- ✅ Open Graph tags for social sharing
- ✅ Canonical URLs
- ✅ Structured data (JSON-LD for Organization and Course)
- ✅ Mobile-friendly responsive design
- ✅ Fast page load times
- ✅ Descriptive page titles

## Form Validation

All forms include client-side validation with friendly error messages:

### Contact Form
- Name: Required
- Email: Required, valid format
- Subject: Required
- Message: Required, minimum 10 characters

### Application Form - Step 1
- Name: Required
- Email: Required, valid format
- Phone: Required, valid phone format

### Application Form - Step 2
- Course: Required
- Bio: Required, minimum 20 characters
- Education: Required

### Application Form - Step 3
- Terms Agreement: Required

### File Upload Validation
- Accepted formats: PDF, Word (.doc, .docx)
- Maximum file size: 5MB

## Testing Checklist

### Functionality
- [ ] All navigation links work correctly
- [ ] Course filtering works (by level)
- [ ] Course detail modal opens and closes
- [ ] Contact form validates and submits
- [ ] Application form validates all steps
- [ ] File upload accepts valid files and rejects invalid ones
- [ ] Admin dashboard loads with demo password
- [ ] Applications appear in admin dashboard after submission
- [ ] AI analysis displays correctly

### Responsiveness
- [ ] Mobile (320px): All content readable, no horizontal scroll
- [ ] Tablet (768px): Layout adjusts appropriately
- [ ] Desktop (1024px+): Full layout with all features visible
- [ ] Touch targets are at least 44x44px on mobile

### Accessibility
- [ ] Keyboard navigation works (Tab through all interactive elements)
- [ ] Focus indicators are visible
- [ ] Form labels are associated with inputs
- [ ] Error messages are announced
- [ ] Images have alt text
- [ ] Color contrast is sufficient (use WebAIM contrast checker)

### Performance
- [ ] Page loads in under 3 seconds
- [ ] Images are optimized (use compressed webp versions)
- [ ] No console errors
- [ ] Lighthouse score above 90

### Cross-Browser
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Deployment

### Manus Deployment

The website is designed to deploy on Manus with built-in hosting:

1. **Create a checkpoint** in the Manus UI
2. **Click Publish** button
3. **Configure domain** (auto-generated or custom)
4. **Site goes live** automatically

### External Deployment Options

#### Netlify

1. Connect your GitHub repository
2. Set build command: `pnpm build`
3. Set publish directory: `dist`
4. Add environment variables (MANUS_API_KEY)
5. Deploy

#### Vercel

1. Import project from GitHub
2. Framework: Other
3. Build command: `pnpm build`
4. Output directory: `dist`
5. Add environment variables
6. Deploy

#### GitHub Pages (Static Only)

1. Build: `pnpm build`
2. Push `dist/` folder to `gh-pages` branch
3. Enable GitHub Pages in repository settings

## Privacy & Data Protection

### GDPR Compliance

The application includes:

- Consent checkbox for data processing
- Clear privacy language on application form
- Data stored only in browser (localStorage) in demo mode
- No tracking of personal data without consent

### Data Retention

In production, implement:

- Data retention policy (e.g., delete after 1 year)
- Secure database encryption
- Regular backups
- Access logs for audit trail

### Recommended Privacy Policy Additions

```
We collect the following information:
- Name, email, phone number
- Educational background
- Resume/CV (optional)
- Application responses

This information is used solely for:
- Admissions evaluation
- Course assignment
- Communication about your application

We do not share your data with third parties.
```

## Troubleshooting

### Issue: Application not submitting

**Solution:** Check browser console for errors. Ensure all required fields are filled. Verify localStorage is enabled.

### Issue: Manus AI not responding

**Solution:** In demo mode, responses are mocked. For production, verify API key is correct and serverless function is deployed.

### Issue: Images not loading

**Solution:** Check that image URLs are correct and accessible. Verify CORS settings if using external CDN.

### Issue: Form validation not working

**Solution:** Clear browser cache. Check that JavaScript is enabled. Verify form field names match validation logic.

## Performance Optimization

### Current Optimizations

- Lazy loading for course images
- Optimized CSS with Tailwind purging
- Minimal JavaScript bundle
- Semantic HTML for fast rendering
- CSS variables for efficient theming

### Future Improvements

- Service worker for offline support
- Image optimization with WebP
- Code splitting for routes
- Database caching
- CDN for static assets

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Development Tools

- **Framework:** React 19 with TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui
- **Routing:** Wouter
- **Build Tool:** Vite
- **Package Manager:** pnpm

## License

This project is proprietary software for SUCCESS THEOLOGICAL SEMINARY AND COLLEGE. All rights reserved.

## Support & Contact

For technical support or questions about the website:

- Email: info@gracebibleschool.org
- Phone: (555) 123-4567
- Address: 123 Faith Street, Spiritual City, SC 12345

## Changelog

### Version 1.0.0 (2026-04-10)

- Initial release
- All core pages implemented
- Manus AI integration (demo mode)
- Admin dashboard with application management
- Responsive design with accessibility features
- Contact form and application portal
- Course catalog with filtering
