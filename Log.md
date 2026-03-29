# CareLink Log File ITR3

## Meeting Minutes & Developmental Summary
### Meeting One
March 9, 2026 @ 5:00 PM – 6:00 PM  
Location: Online  

**Agenda**
- Prepare for ITR 2 extended deadline  
- Identify remaining tasks  
- Assign responsibilities  

**Discussion**
The team met to review progress for ITR 2 and identify remaining work needed before the extended deadline. The main focus was on completing integration testing and finalizing core functionality for the Medication Tracker page.

The Medication Tracker required additional work to support Add, Edit, and Delete functionality. The team discussed ensuring these features were properly connected to the backend and functioning as expected before submission.

**Decisions**
- Prioritize integration testing  
- Complete Medication Tracker Add/Edit/Delete features  
- Focus on stabilizing existing features  

Next Meeting: March 15, 2026  


### Meeting Two
March 15, 2026 @ 12:00 PM – 1:00 PM  
Location: Online  

**Agenda**
- Plan ITR 3 development  
- Review remaining features across all pages  
- Identify system-wide improvements  

**Discussion**
The team met to plan development for ITR 3 and reviewed all pages and features that needed to be completed. Discussions covered improvements across the dashboard, medication tracker, notes, tasks, patient profile, and backend system.

The dashboard required improvements such as integrating appointments, displaying recent notes, and improving UI consistency. The Medication Tracker required full database integration, improved scheduling logic, and support for tracking missed doses and adherence.

The team also discussed implementing system-wide features such as notifications, alerts, analytics, and data export. Additional focus was placed on improving collaboration between caregivers through team and role-based functionality.

Overall, the meeting focused on outlining the full scope of ITR 3 and ensuring all core features were planned before development continued.

**Decisions**
- Expand Medication Tracker functionality and tracking  
- Improve dashboard integration and UI  
- Implement notes, tasks, and patient profile refinements  
- Begin planning for backend data persistence and system-wide features  

Next Meeting: March 16, 2026  


### Meeting Three
March 16, 2026  
Location: In Person  

**Agenda**
- Progress check  
- Review completed features  
- Identify remaining work  

**Discussion**
The team met in person to review individual progress on assigned tasks. Updates were shared on completed features and ongoing development across different pages. The team discussed what still needed to be completed for ITR 3 and identified areas that required additional refinement.

**Decisions**
- Continue development on assigned pages  
- Focus on completing remaining features for ITR 3  

Next Meeting: March 23, 2026  


### Meeting Four
March 23, 2026  
Location: In Person  

**Agenda**
- Progress updates  
- Final feature completion planning  

**Discussion**
The team met to provide updates on progress and discuss final steps required before completing ITR 3. The focus was on ensuring all pages were near completion and identifying any remaining UI or backend work.

**Decisions**
- Prioritize completing remaining features  
- Prepare for final system review  

Next Meeting: March 26, 2026  


### Meeting Five
March 26, 2026  
Location: Online  

**Agenda**
- Final system review  
- UI consistency across all pages  
- Dashboard and Appointment page updates  

**Discussion**
The team met to go through each page and review what still needed to be completed. A major focus was ensuring UI consistency across the entire application. The Medication Tracker page was identified as the reference for UI design, and all other pages were expected to align with it.

The Dashboard and Appointment pages required refactoring to use reusable components instead of custom-built sections. The team discussed standardizing buttons using the shared button component and potentially creating a reusable component for edit, delete, and status actions.

Additional improvements included removing unnecessary UI elements, improving navigation through section cards, and ensuring loading states were consistent across pages.

The Patient Profile required completion of edit and add functionality, while other pages primarily needed UI updates and backend integration.

**Decisions**
- Refactor Dashboard and Appointment pages to use shared components  
- Standardize button styles across the application  
- Use Medication Tracker as the UI reference  
- Ensure consistent loading indicators across pages  
- Complete Patient Profile edit functionality  
- Finalize backend integration across all pages  

Next Meeting: TBD  


## Rationale Behind Major Changes
### Backend Rework

At the end of ITR 2, it was realized that in order to switch to the stub database, more than 1 line of code needed to be changed and that the current structure of the backend would not support new features planned in ITR 3. The decision was made to refactor and rework the entire backend of the website.

A new folder structure, data repositories and classes with interfaces were added to allow an easy switch between the real database and the stub database. Furthermore this new version would support any changes or new features that were planned to be added to the website, with easy implementation.

### Cut Features

Dashboard live schedule was cut from ITR 3 due to there being not enough time to add it

Multiple Tags - Originally Tasks and Notes were planned to support adding multiple tags to 1 task/note. However due to time constraints this feature was cut from ITR 3.

## Development Tasks

### Saneea Khalid
Navigation Bar Development:

Refined the top navigation bar to improve layout, spacing, and overall usability. Updated the patient switcher dropdown to better reflect the selected patient and ensured it integrates smoothly with the patient context. Improved styling and alignment so the navigation is consistent with the rest of the application UI.

Estimated Time: 6 hours  
Actual Time Spent: 5 hours  

Patient Profile Development:

Expanded and completed the Patient Profile page by adding editable fields for key patient information, including name, date of birth, and contact details. Implemented dynamic age calculation based on date of birth to ensure data consistency. Added additional patient details such as mobility, dietary requirements, and physician specialty.

Refactored the page by breaking a large file into smaller reusable components (e.g., contact, medical, and additional info sections) to improve readability and maintainability. Updated the layout to better match the Figma design and improved overall UI structure and consistency.

Estimated Time: 8 hours  
Actual Time Spent: 10 hours  


Medication Tracker Development:

Completed and refined the Medication Tracker page into a full medication management interface. Implemented the medication schedule with support for multiple dose times and improved visual states (taken, pending, overdue). Enhanced the ability to mark medications as taken/un-taken with clear visual feedback.

Expanded the medication details section to include additional fields such as purpose, instructions, prescribed by, warnings, and start date. Improved the add/edit medication flow using a modal and connected it to backend data updates.

Added archived medication functionality with a dedicated view accessible from the UI. Introduced a 7-day adherence overview to track medication completion trends. Refactored the page to ensure consistent use of reusable components and simplified the overall code structure.

Estimated Time: 10 hours  
Actual Time Spent: 12 hours  


Testing (Unit & Integration Testing):

Implemented unit and integration testing across both the Patient Profile and Medication Tracker features to ensure functionality and reliability.

For the Patient Profile, tested component rendering, edit/save interactions, and correct updating of patient data when switching between patients. Verified that dynamic fields such as age update correctly based on user input.

For the Medication Tracker, tested medication scheduling behaviour, toggle interactions for marking medications as taken/un-taken, and correct rendering of medication data. Verified integration between components and backend data flow, including add/edit actions and UI state updates.

Used Vitest and React Testing Library to simulate user interactions and confirm expected behaviour across components and pages.

Estimated Time: 6 hours  
Actual Time Spent: 4 hours  

### Tara

Notes Page:

Implemented Stats Card (Today's Notes, Urgent Notes), Search bar, Filter by time,Urgent Checkbox, Urgent pop ups in orange and some UI design Changes (Colour theme,Lucid Stickers,New Notes pop up page, etc).

Estimated Time: 12 Hours

Actual Time: 10 Hours

Refactoring:

New Stats Card component, Updating the previous Components.

Estimated Time: 6 Hours

Actual Time: 6 Hours 

Implemented Unit & Integration Testing:

Estimated Time: 4 Hours

Actual Time: 6 Hours

- As a Caregiver, I want to be able to create a new note.
- As a Caregiver, I want to view previous notes.
- As a Caregiver, I want to edit existing notes.
- As a Caregiver, I want to delete notes if needed.
- As a Caregiver, I want to see notes in chronological order in CareTimeLine.
- As a Caregiver, I want to see a list of Urgent Notes.

### Jose Urbina

Tasks Page:

Implemented Stats Cards displaying: total amount of tasks, completed tasks, overdue tasks, and pending tasks. The UI design was also improved.

Estimated Time: 5 hours

Actual Time: 3 hours

Teams Page:

Implemented: 
- The ability to switch between teams the user is apart of. 
- Stat Cards displaying: Team members, number of patients, user role, Team join code.
- Edit Team Details options which allows the user to edit their team details (team name, user roles, remove members, add new tags)

The overall page UI design was completely reworked to match the websites design. 

Estimated Time: 10 hours

Actual Time: 12 hours

BackEnd Rework:

Refactor on the services folder. There is a folder called Services which held the files for database querying. Switching to the stub database required more than changing 1 line of code. 

A new folder structure was made to better organize the database querying. Inside Data > repositories are folders for each page containing the new refactored api querying. Each folder has an interface which is implemented into the classes for both the Stub and Api version of data querying. 

Example: 
```
TaskRepo.ts - exported class interface
ApiTaskRepo.ts - class that gets data from the online database
StubTaskRepo.ts - class that gets data from the stub database
```

This layout was repeated in each folder
A switch (index.ts) was also added to easily switch between stub database and online database. Now the persistence layer is not embedded to the presentation and business logic layer.

Estimated Time: 24 hours

Actual Time: ~50 hours

### Adeena Ahmed

Login Page:

Implemented 4 new features for the Login page: show password toggle button, forgot password link, caps lock detection and loading bar.

Estimated Time: 7 hours

Actual Time Spent: 4 hours

Account Settings Page:

Created and developed the frontend of the Account Settings Page. It includes fields for the first name, last name, password, username, email and phone number. It also has a header, profile summary section, personal details section, contact & role section and danger zone section with a delete account button.

Estimated Time : 7 hours

Actual Time Spent: 4 hours

Testing (Unit & Integration Testing):

Implemented unit and integration testing for both the Login page and Account Settings page using the data.ts file and stub data.

Estimated Time: 4 hours

Actual Time spent: 14 hours

Assigned User Stories:

- As a user, I want to be able to see my information that is being used on the website
- As a user I want to be able to see the password I typed or hide it so that it's not visible
- As a user I want an option to sign in, in case I forget my password
- As a user I want to see when Caps Lock is on when I am typing the password
- As a user I want to see a loading bar when the next page is loading after I click the "Login" button

Assigned tasks:

- Worked on the Account Settings page Frontend
- Worked on adding new features to the Login page

### Neharika Sharma
Dashboard & Appointment Integration:

Worked on refining and improving the Dashboard to better support real caregiver workflows. Updated the Dashboard structure to include key information such as tasks, medications, appointments, and recent notes in a more organized and accessible format. Improved navigation flow to ensure caregivers can quickly access important patient information without switching between multiple pages.

Focused on integrating appointment-related data into the Dashboard so that upcoming visits are visible alongside other daily care activities. Ensured that the Dashboard acts as a central hub connecting all major features of the system, including tasks, medications, notes, and appointments.

Refactored parts of the Dashboard and Appointment pages to align with shared UI components and improve consistency across the application. Worked on simplifying layouts, removing unnecessary elements, and ensuring a clean and uniform design based on the agreed UI standard.

Estimated Time: 8 hours  
Actual Time Spent: 9 hours  

Testing (Unit & Integration Testing):

Performed testing on Dashboard functionality to ensure correct display of dynamic data such as tasks, medications, notes, and appointments. Verified that navigation between Dashboard and other pages functions correctly and that updated UI components render consistently.

Estimated Time: 4 hours  
Actual Time Spent: 3 hours  

Assigned User Stories:

- As a caregiver, I want to view a dashboard that summarizes tasks, medications, appointments, and recent notes so that I can quickly understand the patient’s care status for the day.
- As a caregiver, I want to see today’s tasks and their completion status on the dashboard so that I can prioritize my work efficiently.
- As a caregiver, I want upcoming appointments to appear on both the Appointment page and the Dashboard so that I can keep track of schedules in one place.
- As a caregiver, I want recent notes to be visible on the Dashboard so that I can stay updated on patient changes without opening the notes page.
- As a caregiver, I want the Dashboard and Appointment pages to use consistent UI components so that the system is easier to navigate and visually consistent.
- As a caregiver, I want clear navigation from the Dashboard to all major pages so that I can move through the system efficiently.
- As a caregiver, I want important information to be displayed in a structured and readable format so that I can quickly understand patient needs during busy shifts.

