## Inspiration

FitGreen was conceived to empower individuals to lead healthier, more informed lives by integrating cutting-edge technology with accessible health tracking solutions. The idea was inspired by the increasing need for digital wellness tools that encourage accountability, motivate healthy habits, and simplify fitness data management.

## What it does

FitGreen is a full-stack platform that enables users to:

- Register, log in, and securely manage their profiles.
- Track key fitness metrics such as weight, height, age, gender, and water intake.
- Earn points for activities like daily logins and meeting water consumption goals.
- Receive real-time email notifications for account actions such as verification and successful login.
- Access a responsive and engaging user interface tailored for a healthy lifestyle.

## How we built it

- **Frontend:** Developed using Next.js and React for a smooth, server-rendered user experience.
- **Backend:** Leveraged Next.js API routes with MongoDB integration to securely manage user and fitness data.
- **Authentication:** Implemented NextAuth (with the credentials provider) ensuring secure and robust session management.
- **Email Service:** Integrated Mailjet to handle account verification and user notification emails.
- **Rewards System:** Designed a custom points-based system to encourage consistent fitness tracking and healthy habits.

## Points System

The application awards points for user activities as follows:

- **SIGNUP:** Awarded when a user registers – **50 points**
- **DAILY_LOGIN:** Awarded once per day upon login – **10 points**
- **FITNESS_DATA_ENTRY:** Awarded when submitting initial health/fitness metrics – **20 points**
- **WATER_GOAL_COMPLETION:** Awarded once per day if water intake reaches or exceeds 2000ml – **15 points**

## Challenges we ran into

- Ensuring secure storage and handling of sensitive user credentials.
- Managing asynchronous operations and API communications efficiently.
- Seamlessly integrating third-party services such as Mailjet and MongoDB.
- Balancing robust error handling with a responsive user experience.
- Implementing a scalable rewards system that accurately tracks user engagement.

## Accomplishments that we're proud of

- Successful creation of a secure, scalable authentication system.
- A responsive interface that provides real-time insights and motivates users.
- Integration of a customized points-based rewards system that adds an engaging twist to fitness tracking.
- Well-structured API routes and thorough error handling across the full stack.

## What we learned

- Best practices for developing secure full-stack web applications.
- The significance of detailed error management and input validation.
- How to integrate and manage third-party APIs effectively.
- The importance of designing user-centric applications that promote lifestyle improvements.

## What's next for FitGreen

- Expand metric tracking to include additional health and activity data.
- Integrate with wearable devices for real-time data syncing.
- Enhance data visualization for better insights into fitness trends.
- Introduce community features such as challenges, leaderboards, and social sharing to further motivate users.

## Contributors

- [Narayan Bhusal](https://github.com/naranbhusal02) – Lead Developer
- [Nayan Acharya](https://github.com/nayan135) – Lead Developer
- [DILIP ACHARYA](https://github.com/JCT-B) – Backend Developer
- [SHASANK SHRESTHA](https://github.com/shasank00) – Backend Developer
- [SANJOG PANDEY](https://github.com/sanjog) – Frontend Developer
