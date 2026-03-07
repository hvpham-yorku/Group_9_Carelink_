# CareLink Log File ITR2

## Meeting Minutes & Developmental Summary
### Meeting One
February 21, 2026 @ 7:00 PM
Location: Online (Discord)

**Agenda**
- Plan ITR2 functionality goals
- Discuss database integration
- Review upcoming pages and features

**Discussion**
The team met to plan the development goals for ITR 2. Initial discussions focused on how database integration would be structured and how the login page logic would interact with stored data. The team also discussed redesigning the dashboard so that it relied fully on reusable components to improve maintainability and scalability.

Deployment options for the application were also discussed, including whether the final system should be deployed as a web application, website, or mobile app. This decision was left open for further discussion.

The team also reviewed user roles within the system. Initially multiple roles were considered, but the team decided to simplify the system to support only one role, the caretaker. This decision was made to simplify database structure and allow the application to function locally without complex role management.

Additional pages were discussed, including the Patient Profile page and the Landing page, which were both prioritized for development in ITR 2. The Appointment and Scheduling page was discussed but pushed to ITR 3 due to time constraints.

**Decisions**
- System roles simplified to a single caretaker role
- Patient Profile page and Landing page prioritized for ITR 2
- Appointment scheduling feature moved to ITR 3

Next Meeting: March 1, 2026


### Meeting Two
March 1, 2026 @ 10:00 AM
Location: Online

**Agenda**
- Prepare Deliverable 1 presentation
- Clarify grading rubric
- Review presentation slides
- Assign presentation responsibilities

**Discussion**
The team met to prepare for Deliverable 1. The rubric was reviewed to ensure all required sections were addressed in the presentation. The group went through the slides together and discussed the flow of the presentation to ensure that the development process and system functionality were clearly communicated.

Responsibilities for presenting different sections were divided among team members so that each person would present a portion of the project. This meeting focused on organizing the structure of the presentation and ensuring that the demo would clearly demonstrate the system’s current functionality.

**Decisions**
Slides divided among team members
Presentation responsibilities assigned

Next Meeting: March 2, 2026


### Meeting Three
March 2, 2026 @1:00PM
Location: Online

**Agenda**
- Reassess ITR 2 goals
- Prioritize features
- Determine which features should move to ITR 3

**Discussion**
The team met to reassess the scope of ITR 2 to ensure development remained manageable within the iteration timeline. After reviewing the current progress of the project, the team decided that several planned features would be postponed to ITR 3 in order to focus on strengthening the overall system structure.

Features that were moved to ITR 3 included expanded Medication Tracker functionality such as Add, Edit, and Delete capabilities, the User Profile page, and the Appointment page.

The team also partially implemented the Patient Profile page during ITR 2, but decided that the page required additional improvements and refinement. Further development and polishing of the Patient Profile page will therefore continue in ITR 3.

New priorities for ITR 2 were also established. The team shifted focus toward improving collaboration between caregivers by introducing the concept of team-based care coordination. This included the development of a Teams feature and the ability for caregivers to manage multiple patients within a team structure. Sign In and Sign Out functionality was also prioritized to support secure access to the system.

**Decisions**
- Medication Tracker expansion moved to ITR 3
- User Profile page moved to ITR 3
- Appointment page moved to ITR 3
- Patient Profile page partially implemented and pushed for further development in ITR 3
- New focus placed on Teams feature and multi-patient support
- Sign In / Sign Out functionality prioritized

Next Meeting: TBD


## Rationale Behind Major Changes
### Database Platform Change (Firebase -> Supabase)
During the early planning stages of ITR 2, the team initially intended to use Firebase for database integration. Firebase was selected due to its popularity for web applications and its support for real-time data synchronization.

However, during database planning and early testing, the team determined that Firebase did not support the relational data structure required for the project as effectively as anticipated. CareLink requires storing and organizing data across multiple related entities, such as caregivers, teams, and patients, which benefit from a relational database structure.

To better support this structure, the team transitioned to Supabase. Supabase provides a PostgreSQL-based relational database that allows clearer relationships between tables and more structured data organization.

This change allowed the team to better support the relationships between caregivers, teams, and patients while also providing a more scalable database structure for future iterations.

### Feature Prioritization Adjustment
During ITR 2 planning, the team reassessed the scope of planned features to ensure development remained realistic within the iteration timeline. Several planned enhancements were postponed to ITR 3, including expanded Medication Tracker functionality (Add, Edit, Delete), the User Profile page, and the Appointment page.

The Patient Profile page was partially implemented during ITR 2, but the team decided that additional improvements and refinements were required before it could function as intended. As a result, further development and polishing of this page was pushed to ITR 3.

These adjustments allowed the team to focus on strengthening the core structure of the application while preparing the remaining features for a more complete implementation in the next iteration.

### Focus on Team-Based Care Coordination 
CareLink was originally designed as a platform where multiple caregivers could coordinate care for a single patient. During ITR 2 planning, the team expanded this concept into a team-based care structure that allows caregivers to manage multiple patients across different teams.

Under this system, caregivers can join different teams and collaborate with other caregivers to manage the care of various patients. This allows caregivers to participate in multiple care teams and support different patients depending on the situation.

This approach reflects real-world caregiving environments where responsibilities are often shared among multiple individuals and where coordination between caregivers is essential. Prioritizing this structure during ITR 2 helped ensure that the system architecture supports collaborative caregiving and can scale to accommodate more complex care networks in future iterations.

## Development Tasks

### Tara
Tara – Notes Page and Component Refactoring

Tara worked on implementing and improving the Notes feature of the CareLink application. This included developing the notes page functionality and restructuring the page into reusable components to improve maintainability. She implemented the logic for creating and displaying notes and ensured notes were properly organized within the application. Tara also created and implemented test cases for the notes functionality and performed debugging to ensure the feature worked correctly when connected to the database.

### Jose Urbina

Task Management Development Tasks:
- Ability to edit existing tasks
- Ability to delete existing tasks

Estimated Time: 16 hours
Actual Time spent: 5 hours

Backend / Database integration Development Task:
- Business Logic layer
- Persistence Layer
- Creating Database and Database integration

Estimated Time: 3 days

Actual Time spent: 3 days

### Adeena Ahmed

Landing Page Development Tasks:
  1. Create Landing Page NavBar
  2. Create Hero Section
  3. Create Footer Section
  4. Create Call to Action Section
  5. Create About Section
  6. Create Sections which clearly explain the purpose of the platform and audience
  7. Fix navigation routing for Signing in and out of the website

Estimated Time: 14 hours

Actual Time Spent: 12 hours

### Neharika Sharma

Dashboard Development Tasks:

Neha worked on implementing and improving the CareLink Dashboard throughout Iteration 1 and Iteration 2. The dashboard serves as the main page caregivers see after logging into the system and provides a summary of important care information.

During Iteration 1, the initial dashboard interface was implemented and structured into reusable components. Stub data was integrated to allow early testing of the dashboard layout and functionality, and additional improvements were made to the UI to make the page clearer and easier to navigate.

During Iteration 2, the dashboard was connected to the backend using the useDashboardData hook so that real application data could be displayed instead of stub data. Additional features were added to improve the usefulness of the dashboard for caregivers, including displaying task completion statistics, medication tracking summaries, and recent caregiver activity.

Further improvements included adding loading states and error handling for dashboard data retrieval, integrating the dashboard with the selected patient context, and adding navigation shortcuts so caregivers can quickly access important parts of the system.

Estimated Time: 26 hours

Actual Time Spent: 21 hours

### Saneea Khalid
Navigation Bar Development Tasks:
Converted the original sidebar into a top navigation bar to improve the layout and make the interface easier to use. Implemented the patient switcher dropdown so caregivers can quickly switch between different patients. Adjusted the styling and positioning so the navigation integrates cleanly with the rest of the application interface.

Estimated Time: 6 hours
Actual Time spent: 4 hours

Patient Profile Development Tasks:

Designed and implemented the Patient Profile page to display patient information retrieved from the database. Integrated the frontend with the backend patient service so that the correct patient data loads based on the selected patient. Added structured sections for patient details and updated placeholders so unavailable features display as “Not Available” for consistency.

Estimated Time: 10 hours
Actual Time spent: 6 hours
