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

