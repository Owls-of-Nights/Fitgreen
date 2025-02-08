## Inspiration

FitGreen was inspired by the need for a platform that motivates healthier lifestyles by tracking daily fitness and wellness metrics, empowering people to create and maintain healthy habits.

## What it does

- Handles user authentication, registration, and secure sessions.
- Allows users to track fitness metrics such as weight, height, age, gender, and water intake.
- Awards points for achievements like meeting water intake goals and daily login.
- Sends email notifications for verification, login confirmations, and more.

## How we built it

- **Frontend:** Built using Next.js and React for dynamic and server-side rendered pages.
- **Backend:** API routes in Next.js with integration to MongoDB for data storage.
- **Authentication:** Implemented with NextAuth (credentials provider) for robust session management.
- **Email Service:** Integrated Mailjet for sending transactional emails related to user actions.
- **Points System:** Designed a custom rewards system to encourage healthy activities.

## Challenges we ran into

- Managing dynamic routes and consistent data flow between the client and server.
- Handling asynchronous operations and robust error checking across API endpoints.
- Normalizing and validating user inputs during sign-up and data submission.
- Integrating third-party services such as Mailjet and ensuring secure storage of credentials.

## Accomplishments that we're proud of

- Successfully implemented a full-stack health tracking platform.
- Achieved seamless user authentication and session handling with NextAuth.
- Developed a dynamic, responsive interface for monitoring and updating fitness metrics.
- Built a scalable and modular codebase that simplifies future enhancements.

## What we learned

- Best practices for building and managing API routes in Next.js.
- The importance of thorough error handling and input validation.
- How to integrate external services and maintain security in a full-stack application.
- Techniques to design motivational features that add value to user experience.

## What's next for FitGreen

- Enhance the user interface with real-time data visualization.
- Add additional metrics and workout tracking features.
- Integrate wearable device data for automatic metrics updating.
- Expand community features such as challenges, leaderboards, and social sharing.
