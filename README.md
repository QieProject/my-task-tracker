# my-task-tracker

A simple task tracker for assignments, meetings and more. Tasks are saved in your browser, and each task can be sent to Google Calendar.

Link: [https://qieproject.github.io/my-task-tracker/](https://qieproject.github.io/my-task-tracker/)

## How to use

- Tap **Add New Task** to add a task.
- Use **Finish**, **Edit** and **Delete** to manage tasks.
- Tap **Add to Calendar** to open a pre-filled Google Calendar event.
- The coloured boxes at the top show what is overdue, due today, or due soon.
- Tasks are saved in your browser only. Clearing your browser data will remove them.

### Calendar Settings (optional)

If you want each category to have its own calendar (and colour):

1. Open Google Calendar on a computer (or use Desktop site on your phone).
2. Create a new calendar for each category.
3. Go to Settings, choose the calendar, and scroll to **Integrate calendar**.
4. Copy the **Calendar ID** and paste it in **Calendar Settings** in the tracker.

If you leave it empty, events go to your default calendar.

## Version history

### Version 1.7.0 (21/11/26)

- Calendar Settings popup: each user adds their own Google Calendar IDs (saved in the browser)
- How to use popup and guide for getting a Calendar ID
- Empty message when there are no tasks

### Version 1.6.0 (21/11/26)

- Single-page layout with popup form for adding and editing tasks
- Dark theme
- Coloured reminder cards (overdue, due today, due soon)
- Coloured action buttons and status labels

### Version 1.5.1 (20/11/26)

- Set calendar start date same as due date

### Version 1.5.0 (20/11/26)

- Categories changed to Assignment, Meeting, Presentation, Quiz, Test and Other
- Add to Calendar sends the event to a calendar based on its category

### Version 1.4.0 (20/11/26)

- Added Add to Calendar function

### Version 1.3.0 (20/11/26)

- Added edit task function

### Version 1.2.1 (17/11/26)

- Updated README

### Version 1.2.0 (17/11/26)

- Added reminder boxes
- Added browser notification (removed later, replaced by Add to Calendar)

### Version 1.1.1 (13/11/26)

- Added input validation

### Version 1.1.0 (12/11/26)

- Added new fields (category, submission date, date added, description)
- Added finish and delete functions
- Added table
- Added sorting by submission date

### Version 1.0.0 (10/11/26)

- User can enter data
- Data is stored in localStorage