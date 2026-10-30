"""Build a reviewable click-flow book and an offline source-linked action atlas."""
import json, re, html
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sections = []
def chart(title, source, body, note=''):
    sections.append((title, source, body.strip(), note))

chart('01. Login: every action', 'Auth/login.js', '''
flowchart TD
 A[Login screen] -->|Click Email; type email| B[Email value updated locally]
 B -->|Click Password; type password| C[Password value updated locally]
 C -->|Click eye icon| D[Show password]
 D -->|Click eye again| C
 C -->|Click Sign in to LMS| E{Both fields filled?}
 E -->|No| F[Show please fill all fields; remain on login]
 F --> A
 E -->|Yes| G[Disable submit; show Signing you in; call login API C1 / C2]
 G --> H{Response}
 H -->|200| I[Save session tokens and profile; open dashboard]
 H -->|401 or 404| J[Show invalid credentials; re-enable submit]
 J --> A
 H -->|Other failure| K[Loading ends; no additional error toast defined here]
 K --> A
 A -->|Click Forgot password?| L[Open reset-password dialog: chart 02]
 A -->|Click Verify account / resend OTP| M[Open account verification: chart 03]
''')
chart('02. Forgot-password dialog: every action', 'Auth/login.js; utils/ForgotPassword.js', '''
flowchart TD
 A[Reset-password dialog] -->|Click email field; type| B[Registered email updated]
 B -->|Click Reset Password| C{Email provided?}
 C -->|No| D[Show field should not be empty; keep dialog open]
 D --> A
 C -->|Yes| E[Disable reset button; show Sending; API C1 / C2; email C6]
 E --> F{Response}
 F -->|Success| G[Show Password request sent]
 F -->|404 or 500 code| H[Show invalid credentials]
 G --> I[Close dialog; return to login]
 H --> I
 F -->|Other failure| I
 A -->|Click Cancel| I
 A -->|Click X| I
 A -->|Click outside dialog| I
 A -->|Click inside dialog| A
 I -.-> J[Required extension: secure reset token / new password / phone recovery]
''', 'The frontend promises reset instructions, but the reviewed backend sends placeholder email text. The dashed extension is not implemented by these controls.')
chart('03. Account verification and resend OTP', 'Auth/AccountVerification.js', '''
flowchart TD
 A[Verify account screen] -->|Enter email| B[Enable Send OTP when email is non-empty]
 B -->|Select activation or reactivation| C[Store selected purpose]
 C -->|Click Send OTP| D[Please wait; verification API C1 / C2 / C6]
 D --> E{Send succeeds?}
 E -->|No| F[Show provider error; allow retry]
 F --> B
 E -->|Yes| G[Show OTP sent; reveal OTP input and Verify account]
 G -->|Click Resend OTP| D
 G -->|Type OTP| H[Keep numeric digits; maximum six]
 H -->|Exactly six digits; click Verify account| I[Verification API C1 / C2]
 I --> J{Valid OTP?}
 J -->|No| K[Show invalid or expired OTP; retry]
 K --> G
 J -->|Yes| L[Show Account verified. You can now sign in]
 L -->|Browser Back / open login| M[Login screen]
''', 'Phone OTP here activates/reactivates an account. It is separate from forgot-password recovery. This screen does not automatically navigate to login after success.')
chart('04. Shared navigation, notifications, profile and logout', 'components/sideBar.js; components/navBar.js; pages/Profile.js', '''
flowchart TD
 A[Any authenticated page] -->|Click sidebar chevron| B[Expand / collapse sidebar; local only]
 B -->|Click again| A
 A -->|Click ANU logo or Dashboard| C[Role dashboard]
 A -->|Click visible sidebar destination| D[Open selected role-permitted screen; API reads C1 / C2]
 A -->|Click fullscreen icon| E[Enter / exit browser fullscreen]
 A -->|Click bell| F[Open / close notification menu]
 F -->|Click View on notification| G[Close menu; navigate to notification destination]
 F -->|Click Mark as read| H[Update local unread state; applicable Supabase update C2]
 F -->|Click Mark all read| I[Clear unread state; applicable Supabase updates C2]
 A -->|Click user menu| J[Open / close account menu]
 J -->|Click Profile| K[Open read-only profile dialog]
 K -->|Click Close / X / backdrop| A
 J -->|Click Sessions| L[Session management: chart 24]
 J -->|Click Logout| M[Call current-session logout C1 / C2]
 M --> N[Clear local session; navigate to login]
''')
chart('05. Role dashboards', 'components/admin/AdminDashboard.js; components/superadmin/SuperAdminDashboard.js; pages/TutorDashboard.js; components/trainee/TraineeDashboard.js', '''
flowchart TD
 A[Dashboard] --> B{Role}
 B -->|99| C[Super admin]
 C -->|Click Overview| D[Show summary cards]
 C -->|Click Global Activity Tracking / Detailed Audit / View Log| E[Show activity view]
 E -->|Click Refresh Now / Refresh Activity Stats| F[Reload activity data C1 / C2]
 C -->|Click Active Users or Active Users 24h| G[Show user activity view]
 C -->|Click Institutions / related View All| H[Academics]
 C -->|Click Students / Instructors / Courses| I[Corresponding list]
 B -->|101| J[Institution admin]
 J -->|Click Overview / Users| K[Switch dashboard panel]
 J -->|Click Trainees / Instructors / Batches| I
 B -->|102| L[Instructor dashboard]
 L -->|Click Add Course| M[Custom course screen]
 B -->|103| N[Trainee dashboard]
 N -->|Change displayed selectors / chart controls| O[Update corresponding dashboard view]
 N -->|Click query / help entry| P[Queries]
''')
chart('06. Trainee list: view, edit, enable, disable and delete', 'components/admin/traineeList.js', '''
flowchart TD
 A[Trainees screen] -->|Search / change table page or page size| B[Update visible rows]
 A -->|Click Add trainee| C[Open three-step onboarding: chart 08]
 A -->|Click trainee name / View| D[Open trainee dashboard]
 A -->|Click Edit| E[Open edit-trainee dialog]
 E -->|Change permitted fields and batch selection| F[Update form]
 F -->|Click Submit| G[Update trainee API C1 / C2]
 G -->|Success| H[Refresh trainee list]
 G -->|Error| I[Show handled error; correct form]
 I --> E
 E -->|Click X / dialog close| A
 A -->|Click Enable| J[Confirmation toast]
 A -->|Click Disable| J
 A -->|Click Delete| J
 J -->|Click Cancel| A
 J -->|Click Okay| K[Run selected status / delete API C1 / C2]
 K -->|Enable| L[Send verification OTP C6; activation requires verification]
 K -->|Disable or delete succeeds| H
 K -->|Failure| M[Show error and dismiss confirmation]
 H --> A
''')
chart('07. Instructor list and instructor profile', 'pages/Instructors.js; pages/IndividualInstructors.js', '''
flowchart TD
 A[Instructors] -->|Search / select page / page size| B[Update displayed rows]
 A -->|Click Add Instructor| C[Three-step onboarding: chart 08]
 A -->|Click instructor name| D[Instructor profile and associated batches]
 D -->|Click batch link| E[Batch profile]
 A -->|Click batch expander| F[Expand / collapse assigned batch names]
 A -->|Click Edit| G[Open instructor-edit dialog]
 G -->|Change form selections; click Submit| H[Update instructor API C1 / C2]
 H -->|Success| I[Refresh instructor list]
 H -->|Error| G
 G -->|Click X / close| A
 A -->|Click Delete| J[Confirmation toast]
 J -->|Cancel| A
 J -->|Okay| K[Delete instructor API C1 / C2]
 K -->|Success| I
 K -->|Failure| L[Show error]
 I --> A
''')
chart('08. Add trainee / instructor: step-by-step', 'components/admin/addTrainee.js; components/admin/step/AddTraineeStep1.js; components/admin/step/AddTraineeStep2.js; components/admin/step/AddTraineeStep3.js', '''
flowchart TD
 A[Open trainee/add or instructor/add] --> B[Step 1: personal details and applicable batch selections]
 B -->|Click each field / dropdown / date control| C[Update local form values]
 C -->|Click Next when available| D[Step 2: password and confirmation]
 D -->|Edit password and confirmation; select Active / Inactive status| E[Update account fields locally]
 E -->|Click Prev| B
 E -->|Click Next| F[Step 3: photograph]
 F -->|Click Upload File| G[Open system file picker]
 G -->|Choose file| H[Store selected file and preview]
 H -->|Click Prev| D
 H -->|Click Submit| I{Passwords match?}
 I -->|No| J[Show password mismatch]
 J --> D
 I -->|Yes| K[Submit multipart onboarding API C1 / C2; photo C3; verification C6 where triggered]
 K -->|Success| L[Show added message; redirect to trainee or instructor list]
 K -->|Duplicate| M[Show already exists; configured redirect]
 K -->|Missing data / photo / permission| N[Show corresponding error]
''', 'The control appendix lists the exact step fields and disabled conditions. The step navigation should not be interpreted as stronger validation than the source implements.')
chart('09. Batch list: tabs, create, filter, edit and delete', 'pages/Batch.js', '''
flowchart TD
 A[Batch screen] -->|Click Batch List tab| B[Show batches]
 A -->|Click Targeted Learning tab| C[Show targeted groups: chart 10]
 B -->|Click batch name| D[Batch profile]
 B -->|Click filter icon| E[Filter dialog]
 E -->|Choose filters; click Apply| F{Any filter filled?}
 F -->|No| G[Show required-filter message]
 G --> E
 F -->|Yes| H[Fetch filtered batches C1 / C2]
 E -->|Close / backdrop| B
 B -->|Click Create Batch| I[Create-batch dialog]
 I -->|Fill name / dates; select curriculum then certificate| J[Update form; dependent lists load]
 J -->|Click Save| K[Validate; create-batch API C1 / C2]
 K -->|Success| L[Close / reset form; refresh list]
 K -->|Missing or duplicate data| I
 I -->|Click X / backdrop| B
 B -->|Click row menu then Edit| M[Edit batch name and dates]
 M -->|Click Update| N[Validate; update-batch API C1 / C2]
 N -->|Success| L
 N -->|Error| M
 M -->|Click Close| B
 B -->|Row menu then Delete| O[Confirmation toast]
 O -->|Cancel| B
 O -->|Okay| P[Delete API C1 / C2; refresh on success]
''')
chart('10. Targeted learning and batch profile', 'pages/Batch.js; pages/BatchIndividual.js', '''
flowchart TD
 A[Targeted Learning tab] -->|Click create icon| B[Create Targeted Learning dialog]
 B -->|Select curriculum / certificate / modules / resource type / resources| C[Load and update dependent choices C1 / C2]
 C -->|Select assigned users; enter dates and other required details| D[Update local form]
 D -->|Click Initiate| E{Required fields complete?}
 E -->|No| B
 E -->|Yes| F[Create targeted learning API C1 / C2]
 F -->|Success| G[Close dialog; refresh groups]
 F -->|Error| B
 B -->|Click X / backdrop| A
 A -->|Click name / View| H[Batch or targeted-group profile]
 H -->|Click Home| I[Dashboard]
 H -->|Click unbound header sort icon| J[No sorting handler attached]
 A -->|Row menu then Delete| K[Confirmation toast]
 K -->|Cancel| A
 K -->|Okay| L[Delete targeted learning API C1 / C2]
''')
chart('11. Curriculum', 'pages/Curiculum.js', '''
flowchart TD
 A[Curriculum list] -->|Click Create curriculum| B[Creation dialog]
 B -->|Fill curriculum fields; click Save curriculum| C[Create curriculum API C1 / C2]
 C -->|Success| D[Refresh list / close as implemented]
 C -->|Failure| B
 B -->|Click Close / backdrop| A
 A -->|Click row Actions| E[Open row menu]
 E -->|Click View / Add course| F[Certifications list]
 E -->|Click Tag trainees| G[Trainees list]
 E -->|Click Tag instructors| H[Instructors list]
 E -->|Click Delete| I[Delete confirmation]
 I -->|Cancel| A
 I -->|Okay| J[Delete curriculum API C1 / C2]
 J --> A
''')
chart('12. Certifications: create, expand, view, tag and delete', 'pages/Course.js', '''
flowchart TD
 A[Certifications list] -->|Search / sort / pagination controls| B[Change table view]
 A -->|Click row expand arrow / expandable label| C[Expand or collapse row]
 A -->|Click course name / row-menu View| D[Open certification detail: chart 13]
 A -->|Click Add Course| E[Add-course dialog]
 E -->|Fill name / select curriculum; click Save| F[Create certificate API C1 / C2]
 F -->|Success| A
 F -->|Error| E
 E -->|Click X / backdrop| A
 A -->|Row menu; click Tag Course| G[Tag-course dialog]
 G -->|Choose associations; click Save| H[Tag API C1 / C2]
 H -->|Success| A
 H -->|Duplicate or failure| G
 G -->|Click X / backdrop| A
 A -->|Row menu; click Delete| I[Delete confirmation]
 I -->|Cancel| A
 I -->|Okay| J[Delete certificate API C1 / C2]
 J --> A
''')
chart('13. Certification detail: expand modules, resources and completion', 'pages/InsideCertifications.js; components/CreateResources.js', '''
flowchart TD
 A[Certification detail] -->|Click module expand arrow| B[Expand / collapse module]
 B -->|Click resource-type expander| C[Expand / collapse category]
 C -->|Click topic expander if present| D[Expand / collapse topic]
 C -->|Click resource row| E[Open trainee completion popup C1 / C2]
 E -->|Click View Profile| F[Open selected trainee dashboard; close popup]
 E -->|Click X / backdrop| A
 A -->|Click add learning-module icon| G[Create Learning Module dialog]
 G -->|Fill course / module / unit / certification; click Create| H[Create learning module API C1 / C2]
 H -->|Success| A
 H -->|Error| G
 G -->|Click X / backdrop| A
 B -->|Click add-resource icon| I[Create Resource dialog]
 I -->|Select resource type; fill applicable fields; click Create| J[Create resource API C1 / C2]
 J -->|Success| A
 J -->|Error| I
 I -->|Click X / backdrop| A
 C -->|Click Attach Volume| K[Attach-volume dialog: chart 14]
 C -->|Click question-editor icon| L[Question editor: chart 15]
 A -->|Click Learning Modules breadcrumb| M[Request-raised screen as currently wired]
''')
chart('14. Attach volume to a learning resource', 'pages/InsideCertifications.js', '''
flowchart TD
 A[Click Attach Volume on resource] --> B[Open attachment dialog with resource selected]
 B -->|Choose volume| C[Load shadow and step recording choices C1 / C2]
 C -->|Choose shadow / step recording| D[Update selections]
 D -->|Click Attach| E[Disable while attaching; association API C1 / C2]
 E -->|Success| F[Show success; clear selection; close dialog]
 E -->|Error| G[Show error; keep form for correction]
 G --> B
 B -->|Click Cancel / X / backdrop| H[Close attachment dialog]
''')
chart('15. Question editor: every type of action', 'components/MindSparkQuestionModal.js; pages/Resource.js', '''
flowchart TD
 A[Question editor] -->|Edit MindSpark number / question number / question type| B[Update current question form]
 B -->|Edit prompt / unit / image URL / video URL / timing / guidance / feedback| B
 B -->|Choose image file| C[Select image; execute upload path where configured C1 / C3]
 B -->|Edit option key / text / image / alternative text| D[Update option]
 D -->|Choose correct answer| E[Update answer key]
 B -->|Click Add Option / Add Step| F[Append option or step row]
 F -->|Click row remove icon| G[Remove selected option / step]
 B -->|Click Add Question| H[Append question form]
 H -->|Click question delete icon| I[Remove selected question]
 B -->|Edit assets / metadata fields| J[Update structured payload inputs]
 B -->|Click Save Questions| K[Validate and save configured questions C1 / C2; assets C3 when uploaded]
 K -->|Success| L[Success / refresh according to hosting screen]
 K -->|Error| M[Show validation or request error; correct form]
 M --> B
 A -->|Click X / dialog close| N[Return to hosting resource screen]
''', 'This is content authoring. The learner View Questions dialog is a separate read-only view; do not invent a web quiz-submit button.')
chart('16. Alternate chapter, module and resource routes', 'pages/Chapters.js; pages/Module.js; pages/Resource.js', '''
flowchart TD
 A[Chapters screen] -->|Click chapter| B[Module list]
 A -->|Click add icon| C[Create Chapter dialog]
 C -->|Select course / enter fields; click Save| D[Create chapter API C1 / C2]
 D --> A
 C -->|Close| A
 B -->|Click module| E[Resource list]
 B -->|Click add icon| F[Create New Module dialog]
 F -->|Select chapter / enter fields; click Save| G[Call module API C1 / C2; close dialog]
 G --> B
 F -->|Close| B
 E -->|Click add icon| H[Create New Resource dialog]
 H -->|Fill fields; click Save| I[Create resource API C1 / C2]
 I --> E
 H -->|Close| E
 E -->|Click question icon| J[Question editor: chart 15]
 A -->|Click Course breadcrumb| K[Current target /course is not registered; fallback login]
 B -->|Click Course breadcrumb| K
 E -->|Click Course breadcrumb| K
 B -->|Click Chapters breadcrumb| L[Navigate to stored last_page_visited value]
 E -->|Click Chapters breadcrumb| L
''', 'These are registered alternate routes. The modern certification-detail flow is chart 13. The legacy /course breadcrumb target differs from the registered /certificate route.')
chart('17. Course access, visibility, assignments and migration review', 'pages/ContentAccess.js', '''
flowchart TD
 A[Content Access / Assigned Courses] -->|Click Open| B[Certification detail]
 A -->|Click Create course| C[Draft-course form]
 C -->|Fill fields; click Create draft| D[Create draft API C1 / C2; refresh list]
 C -->|Click close| A
 A -->|Click Assignments| E[Assignment dialog]
 E -->|Select available batches / users; click Save assignments| F[Replace assignments API C1 / C2]
 F -->|Success| A
 E -->|Click close| A
 A -->|Click Publish / Unpublish / Archive| G[Change selected course state C1 / C2; reload]
 A -->|Change institution visibility; click Save visibility| H[Save institution access C1 / C2; reload]
 A -->|Fill institution-admin form; click Add| I[Create admin C1 / C2; verification C6; show returned credentials]
 A -->|Fill super-admin form; click Add Super Admin| J[Create super admin C1 / C2; verification C6]
 I -->|Click Dismiss| A
 J -->|Click Dismiss| A
 A -->|Click review Global core / Global specialized / Set institution| K[Resolve course ownership C1 / C2]
 A -->|Click volume Global / Set institution| L[Resolve volume ownership C1 / C2]
 A -->|Click Migrate institution course / core / specialized| M[Migrate legacy mapping C1 / C2]
''', 'Creation, publishing, assignment and migration actions are conditionally displayed by role. Inspect the role conditions in the source-linked appendix; all actions are not available to every user.')
chart('18. Volume list: upload, filters, menus and edit', 'pages/VolumeList.js', '''
flowchart TD
 A[Volumes] -->|Type search / select anatomy, approval or conversion filter| B[Update visible volume rows]
 A -->|Click Upload Volume| C[Upload dialog]
 C -->|Fill metadata / presentation / trimester| D[Update form]
 D -->|Click file selection area| E[Open file picker]
 E -->|Choose up to ten .vol files| F[Validate selection; show selected files]
 F -->|Click Remove file| G[Remove selected file locally]
 G --> F
 F -->|Click Upload| H{Required data and files valid?}
 H -->|No| I[Show error; stay in dialog]
 I --> C
 H -->|Yes| J[Upload each selected file C1 / C3; metadata C2]
 J -->|Success| K[Show uploaded result; clear / close; reload volumes]
 J -->|Partial or request failure| L[Show error / per-file result; inspect before retry]
 C -->|Click X / backdrop| A
 A -->|Click row menu; Edit| M[Edit volume dialog]
 M -->|Change metadata; click Save Changes| N[Validate; update-volume API C1 / C2]
 N -->|Success| K
 N -->|Error| M
 M -->|Click Cancel / X / backdrop| A
 A -->|Row menu; Request conversion| O[Submit Batch conversion C1 / C2 / C4]
 O -->|Accepted| P[Show Conversion Started; update local processing state]
 O -->|Failed| Q[Show conversion error; allow retry]
 A -->|Click Home| R[Dashboard]
''')
chart('19. Volume files: downloads, placement upload and recordings', 'pages/VolumeList.js; components/Instructors/VolumeRecordingDownloads.js', '''
flowchart TD
 A[Volume row] -->|Click Source file| B[Request authorized download URL C1 / C2]
 A -->|Click Converted file| B
 A -->|Click Download JSON file| B
 B -->|URL returned| C[Download from object storage: GET + egress C3]
 B -->|Failure| D[Show download error; reset busy state]
 A -->|Choose placement JSON file| E[Read / validate and upload placement C1 / C3; reference C2]
 E -->|Success| F[Refresh placement state]
 E -->|Error| G[Show error; choose corrected file]
 A -->|Click Recording files| H[Open recording-download dialog; load list C1 / C2]
 H -->|Click recording / audio / image / Manifest download| I[Prepare authorized URL C1 / C2]
 I --> C
 H -->|Click X / backdrop| J[Close recording dialog]
''')
chart('20. Cluster management and recording controls', 'pages/Cluster.js', '''
flowchart TD
 A[Clusters] -->|Type Search clusters| B[Filter visible rows locally]
 A -->|Click Edit Cluster| C[Open selected-cluster edit dialog]
 C -->|Change name / fetal presentation / volume selections| D[Update form]
 D -->|Click Save Changes| E[Validate; update API C1 / C2; update local cache]
 E -->|Success| F[Close dialog; show refreshed cluster]
 E -->|Failure| G[Apply source fallback / show outcome; inspect server persistence]
 C -->|Click Cancel / X / backdrop| A
 A -->|Click Delete Cluster| H[Invoke delete path C1 / C2; update local list / cache]
 A -->|Click Home| I[Dashboard]
 J[Add-cluster dialog defined in source] -->|Select volumes / enter fields; click Add Cluster| K[Validate; create API C1 / C2 with local fallback]
 J -->|Click Cancel / X / backdrop| A
 L[Recording dialog defined in source] -->|Select volume / type / recording name| M[Update recording form]
 M -->|Choose JSON / WAV / images / manifest| N[Update selected files]
 N -->|Click Upload Recording| O[Validate required assets; upload C1 / C3; metadata C2]
 L -->|Click Replace Existing Recording| P[Select existing recording and replacement files]
 P -->|Click Replace Recording Files| Q[Validate at least one replacement; replace API C1 / C3 / C2]
 O -->|Success| R[Close; update recording counts / cache]
 Q -->|Success| R
 O -->|Error| L
 Q -->|Error| L
 L -->|Click Cancel / X when not uploading| A
''', 'The current rendered cluster table exposes Edit and Delete. Add-cluster and recording dialogs exist in the source, but an opening click was not found in the rendered table/header reviewed. They are shown as separate entry points, not as functioning navigation from the cluster list. Some cluster API failures use local-storage fallback, so a success-looking UI does not prove cloud persistence.')
chart('21. Course mapping, custom courses and reattempt configuration', 'pages/CourseMapping.js; pages/CustomCourse.js; pages/ReattData.js', '''
flowchart TD
 A[Course Mapping] -->|Choose volume / trimester / module / unit / course type| B[Update form; load dependent recording choices C1 / C2]
 B -->|Choose optional shadow / step recording; click Create Mapping| C[Validate; create mapping C1 / C2]
 C -->|Success| D[Clear form and reload mappings]
 C -->|Error| B
 A -->|Click form Clear| E[Reset form and recording choices locally]
 A -->|Choose list filters; click Apply / Refresh| F[Fetch mappings C1 / C2]
 A -->|Click filter Clear| G[Reset filters and reload as implemented]
 H[Custom Course] -->|Click Add Course| I[Custom-course dialog]
 I -->|Enter details; select volume / course type / recordings| J[Update form]
 J -->|Click Create Course| K[Validate details and trimester; create mapping C1 / C2]
 K -->|Success| H
 K -->|Failure| I
 I -->|Click Clear| L[Reset form and recording choices]
 I -->|Click X / backdrop| H
 H -->|Click Back| M[Dashboard]
 N[Reattempts] -->|Choose certificate / course / unit / resource; edit allowed values| O[Update dependent selections]
 O -->|Click Save| P[Validate; save reattempt configuration C1 / C2]
 N -->|Click Clear| Q[Reset form]
 N -->|Click Refresh / Apply filters| R[Fetch reattempt settings C1 / C2]
 N -->|Click Clear Filters| S[Reset list filters and reload]
''')
chart('22. My Learning: every navigation and detail action', 'pages/MyLearning.js', '''
flowchart TD
 A[My Learning] -->|Click certification tab| B[Switch certification; choose module; reset filters / search / open topics]
 B -->|Click module| C{Module locked?}
 C -->|Yes| D[Remain on current module]
 C -->|No| E[Switch module; reset local view]
 E -->|Click activity filter / change search| F[Filter visible resources]
 F -->|Click topic header / expander| G[Expand / collapse resource group]
 G -->|Click image-interpretation row| H[Open image-interpretation detail]
 G -->|Click MindSpark row| I[Open configured MindSpark question viewer]
 G -->|Click View Questions| I[Open configured MindSpark question viewer]
 G -->|Click Score| J[Open attempt details without feedback / submission view]
 G -->|Click View| K[Open applicable attempt / feedback / submission details]
 H -->|Click attempt / question expander| L[Expand / collapse details]
 K -->|Click detail tab| M[Switch displayed detail tab]
 K -->|Click User image / Expert image| N[Open asset link; image delivery C3]
 H -->|Click View submitted image| N
 I -->|Click Close / X / backdrop| A
 H -->|Click Close / X / backdrop| A
 J -->|Click Close / X / backdrop| A
 K -->|Click Close / X / backdrop| A
''', 'The learner controls reviewed show questions, submissions and attempts. Actual VR task performance and submission occur through the headset API contract; the chart does not introduce absent web Start VR / quiz-submit controls.')
chart('23. My Progress, schedules, queries and reports', 'pages/MyProgress.js; pages/Schedules.js; pages/Queries.js; pages/Reports.js', '''
flowchart TD
 A[My Progress] -->|Click certification tab| B[Switch progress dataset / display]
 C[Schedules] -->|Click Previous period / Next period| D[Move calendar interval]
 C -->|Click Today| E[Return to current date]
 C -->|Click Month / Week| F[Change calendar view]
 C -->|Click calendar event / upcoming event| G[Open associated batch profile]
 H[Queries] -->|Click Create Query| I[Query dialog]
 I -->|Choose type / enter text; click Submit| J[Create query API C1 / C2]
 J -->|Success| K[Close / refresh query list]
 J -->|Error| I
 I -->|Click X / backdrop| H
 H -->|Click row menu then View| L[Close menu only; no detail view opened in current handler]
 H -->|Click Mark as Resolved| M[Update status API C1 / C2; refresh]
 H -->|Click Delete| N[Delete query API C1 / C2; refresh]
 H -->|Change table pagination| O[Update displayed rows]
 P[Reports] -->|Change active date controls| Q[Update selected dates where handlers exist]
 P -->|Click unbound report / filter button| R[No attached action handler found]
''')
chart('24. Device sessions and forced logout', 'pages/Sessions.js; routes/ProtectedRoutes.js', '''
flowchart TD
 A[Sessions] -->|Type user search when permitted| B[Fetch matching users C1 / C2]
 B -->|Select user| C[Load that user's permitted sessions C1 / C2]
 A -->|Click Previous / Next / page number| D[Change local displayed session page]
 C -->|Click active session Logout| X{Confirm browser dialog?}
 X -->|Cancel| A
 X -->|OK| E[Run per-session termination handler C1 / C2]
 E -->|Success| F[Reload session list]
 E -->|Failure| G[Show error]
 A -->|Click Logout all sessions| Y{Confirm browser dialog?}
 Y -->|Cancel| A
 Y -->|OK| H[Run all-session termination handler C1 / C2]
 H -->|Current user's sessions ended| I[Clear local session; open login]
 H -->|Other permitted user's sessions ended| F
 J[Authenticated page] -->|Automatic 10-second heartbeat / focus check| K[Validate session C1 / C2]
 K -->|401 / 403| I
 J -->|Session revoked socket event| I
''', 'Session buttons are disabled while busy/loading or when no applicable active session exists. The source-linked atlas includes these exact conditions. Automatic heartbeat requests also incur usage although no user clicks them.')
chart('25. Streams: trainee preview and admin selection', 'pages/Stream.js; components/streaming/TraineeStreamPanel.js; components/streaming/AdminStreamPanel.js', '''
flowchart TD
 A[Click Streams] --> B{Role}
 B -->|103| C[Open trainee self-preview; request viewer token C1 / C2]
 C --> D{Headset stream available?}
 D -->|Yes| E[Connect to private IVS stage; participant time C5]
 D -->|No| F[Show waiting / unavailable state]
 E -->|Click Enable audio / Mute audio| G[Toggle local preview audio]
 E -->|Click Reconnect preview when displayed| H[Increment attempt; reconnect viewer C1 / C2 / C5]
 H --> D
 B -->|101| I[Open institution monitoring; load stage / stream state C1 / C2 / C5]
 I -->|Click LIVE trainee tile| J[Select displayed trainee stream]
 B -->|Other role| K[Redirect to dashboard]
 L[Headset starts publishing via headset API] --> M[Private IVS publisher; center replication C5]
 M --> E
 M --> I
''', 'The web screen does not supply a headset Start Publishing click. That click sequence needs the Unity/headset source. Live participant-hour charges continue while connected, even without additional clicks.')
chart('26. Academics: onboard, filters and unfinished actions', 'pages/Academics.js', '''
flowchart TD
 A[Academics / scan centers] -->|Click Onboard Scan Center| B[Onboarding dialog]
 B -->|Enter scan-center fields; click Onboard Scan Center| C{All required fields filled?}
 C -->|No| D[Show required-field error]
 D --> B
 C -->|Yes| E[Create scan-center API C1 / C2; configured credential notification C6]
 E -->|Success| F[Show success; refresh centers]
 E -->|Failure| B
 B -->|Click Cancel / X / backdrop| A
 A -->|Click filter icon| G[Filter dialog]
 G -->|Select filters; click Apply| H[Validate filter; filter current centers locally]
 G -->|Click Clear| I[Reset filters; show all loaded centers]
 G -->|Click X / close| A
 A -->|Row menu; click View Details| J[Console log only; no detail screen opened]
 A -->|Row menu; click Edit| K[Edit dialog]
 K -->|Edit fields; click Update Scan Center| L[Validate; success toast / refresh; update API is commented out]
 K -->|Click Cancel / X / backdrop| A
 A -->|Row menu; click Delete| M{Confirm browser dialog?}
 M -->|Cancel| A
 M -->|OK| N[Delete API is commented out; success message is not proof of deletion]
''', 'The charts retain incomplete UI actions as found. They must not be presented as successful database updates or deletes.')

intro = '''# Project ANU — Click-by-click flowchart book

Reviewed 30 October 2026. This expands the earlier architecture flow into individual UI actions. Every named edge is a click, input, choice or explicit automatic event. Read each screen separately; the same flow applies to each repeated table row.

**Scope:** current React LMS frontend and its handlers, plus the documented headset API boundary. The Unity/headset source is not present in this reviewed frontend, so a complete headset-button sequence cannot be asserted. Registered routes, conditional UI, dialogs defined without visible openers, placeholders and controls without handlers are distinguished explicitly. This is static source analysis, not a browser walkthrough or a guarantee that the deployed application behaves identically.

**Cost markers:** C1 = API/backend; C2 = database; C3 = object storage, file requests and delivery; C4 = conversion compute; C5 = IVS live participant time; C6 = email/SMS provider. Unmarked view toggles are local unless their hosting component triggers a subsequent fetch. The pricing formulas and sources are in [the cloud-cost guide](ANU_USER_FLOWS_AND_CLOUD_COSTS.md). A click does not have a flat cloud price: duration, file size, requests, retention and plan determine the charge.

**How to review:** the HTML action atlas provides a diagram for every extracted control in the reachable source graph, including fields, selectors, table pagination and library component callbacks. It includes source line references, disabled conditions and event handlers for verification. The charts below provide the readable sequential flows; the action atlas is the completeness appendix. Decorative ripple/focus callbacks and generic modal wrappers are recorded as source evidence, not separate business tasks. Conditional and dynamically generated controls may have different labels at runtime.

'''
doc = intro + '\n'.join(f'## {t}\n\nSource: `{s}` (under `client/src/`).\n\n```mermaid\n{b}\n```\n\n{n}\n' for t,s,b,n in sections)
doc += '''\n## Screen navigation by role

| Role | Visible sidebar destinations in current source |
|---|---|
| Super admin 99 | Dashboard, Curriculum, Certifications, Volumes, Cluster, Course Mapping, Reattempts, Academics, and role-conditional Content Access |
| Institution admin 101 | Dashboard, Batch, Instructors, Trainees, Schedules, Certifications, Streams, Volumes, Cluster, and role-conditional Content Access |
| Instructor 102 | Dashboard, Batch, Trainees, Certifications, Volumes, Cluster, SVT Course, and role-conditional Content Access |
| Trainee 103 | Dashboard, My Learning, Schedules, Queries, Batch, Streams, and role-conditional Assigned Courses |

Navbar Profile, Sessions, Notifications and Logout are documented separately. Route access checks remain authoritative. My Progress, Reports and other registered screens are included even if not present in the current role's sidebar.

## Files for review

- `ANU_CLICK_ACTION_ATLAS.html`: offline, searchable control diagrams and source evidence.
- `ANU_UI_ACTION_INVENTORY.json`: extracted controls, handlers, conditions, source lines and static reachability.
- `extract-ui-actions.cjs`: regenerate the source inventory after code changes.
- `build-click-flowcharts.py`: regenerate this book and the atlas.
'''
(ROOT/'ANU_CLICK_BY_CLICK_FLOWCHARTS.md').write_text(doc, encoding='utf-8')

data = json.loads((ROOT/'ANU_UI_ACTION_INVENTORY.json').read_text(encoding='utf-8'))
active = [a for a in data if a['reachable']]

def human(value):
    value = re.sub(r'([a-z0-9])([A-Z])',r'\1 \2',value)
    return value.replace('_',' ').strip()

overrides = {
 ('Auth/login.js','handleSubmit'): 'Validate email/password; call login; success → dashboard; invalid credentials → login error.',
 ('Auth/login.js','ResetPassword'): 'Validate email; send reset request; show result; close dialog. Backend reset email is a placeholder.',
 ('Auth/login.js','handleToggle'): 'Show or hide the password text locally.',
 ('Auth/login.js','handleForgotPassword'): 'Open the reset-password dialog.',
 ('Auth/AccountVerification.js','requestOtp'): 'Send / resend account-verification phone OTP; success reveals the six-digit OTP field; error allows retry.',
 ('Auth/AccountVerification.js','verify'): 'Verify account activation/reactivation OTP; show success or invalid/expired OTP. No automatic login redirect.',
 ('pages/Academics.js','handleDelete'): 'Incomplete action: delete API is commented out. A success toast does not establish cloud deletion.',
 ('pages/Academics.js','handleUpdateSubmit'): 'Validate edit form; update API is commented out. A success toast does not establish cloud update.',
 ('pages/MyLearning.js','handleClick'): 'Image-interpretation row opens interpretation details; MindSpark row opens the question viewer; other row bodies do not launch an action.',
 ('components/navBar.js','handleLogout'): 'Log out current server session; clear local authentication; open login.',
 ('pages/Cluster.js','handleDeleteCluster'): 'Invoke cluster deletion and update local cached list; inspect fallback behaviour before assuming server deletion.',
}
statewords = {'Open':'open state','Show':'visibility','Selected':'selection','Search':'search','Filter':'filter','Page':'page','Form':'form','Type':'type','Tab':'tab','Expanded':'expanded section','Active':'active view','Loading':'loading state'}
def effect(a):
    if a.get('to'):
        return 'Open destination: '+a['to']
    ev = [e for e in a['events'] if e['event'] not in ('onMouseDown','onFocus','onBlur')]
    if not ev:
        if a.get('type')=='submit':return 'Submit the containing form; follow its onSubmit branch on this screen.'
        if a['tag'] in ('input','select','textarea'):return 'Native field interaction; no explicit change handler attached to this control.'
        return 'No primary action handler attached. Decorative callbacks may still be present.'
    for e in ev:
        for (suffix,handler), outcome in overrides.items():
            if a['file'].endswith(suffix) and re.search(r'\b'+re.escape(handler)+r'\b',e['handler']):return outcome
    text='\n'.join(e['expanded'] for e in ev)
    handler='; '.join(e['handler'] for e in ev)
    if 'stopPropagation' in handler and len(handler)<60:return 'Keep the dialog open; prevent this inner click from closing the backdrop.'
    if re.search(r'console\.log',handler) and not re.search(r'await|API|api\.',handler):return 'Current handler logs / closes menu only; no detail screen or cloud update established.'
    nav=re.findall(r'navigate\(([^\n;]+?)\)',text)
    if nav:return 'Navigate to '+nav[0]+('. Other local updates occur in the handler.' if 'set' in text else '.')
    if 'onClose' in handler or re.search(r'\b(closeModal|handleClose|handleCloseModal|closeQuestionForm|closeCompletionPopup|closeToast)\b',handler):return 'Close / dismiss this dialog, menu or toast; return to the hosting screen.'
    if 'toggleFullscreen' in handler:return 'Toggle browser fullscreen; no cloud storage operation.'
    if 'toggleAudio' in handler:return 'Mute / enable local preview audio; IVS participant connection continues.'
    if 'handleDownload' in handler or 'volumeDownloadAPI' in text:return 'Request authorized file URL; download selected cloud asset; show error if request fails.'
    if '.click()' in handler:return 'Open the linked file picker or native browser control.'
    apis=list(dict.fromkeys(re.findall(r'\b([A-Za-z_$][\w$]*(?:API|Api))\s*\(',text)))
    if apis:return 'Call '+', '.join(human(x.removesuffix('API').removesuffix('Api')) for x in apis[:3])+'. Follow success/error handling; see source evidence for exact outcomes.'
    if re.search(r'\b(?:axios|api)\.(?:get|post|put|patch|delete)|await |supabase\s*\.',text):return 'Run the associated request / asynchronous action; apply the source-defined result and error handling.'
    setters=list(dict.fromkeys(re.findall(r'\bset([A-Z]\w*)\s*\(',handler)))
    if setters:return 'Update '+', '.join(human(x).lower() for x in setters[:4])+'; remain in the local view unless a dependent effect loads data.'
    if any(e['event']=='onChange' for e in ev):return 'Update the selected field / filter value; dependent options may reload through the hosting component.'
    names=re.findall(r'\b(?:handle|toggle|open|close|save|submit|remove|add|create|delete|update|fetch|select|resolve|migrate|change)[A-Z]\w*',handler)
    if names:return 'Action: '+', '.join(human(x) for x in dict.fromkeys(names))[:200]+'. Consult the sequential chart and source evidence for the full branch.'
    return 'Delegate this event to the parent / library callback; follow the hosting screen flow. Runtime label may depend on data.'

def cost(a):
    text=' '.join(e['expanded'] for e in a['events'])
    if 'commented out' in effect(a):return 'No persisted write established'
    if a.get('to') or 'navigate(' in text:return 'Local navigation; destination may load C1 / C2'
    if re.search(r'Download|download|upload|Upload|userImage',text) and re.search(r'API|await|fetch|api\.',text):return 'C1 / C2; file transfer or storage C3 where invoked'
    if 'volumeConvAPI' in text:return 'C1 / C2 / C4'
    if 'requestOtp' in text or 'verifyAccount' in text or 'ForgotPasswordAPI' in text:return 'C1 / C2; message delivery C6 where sent'
    if re.search(r'API\s*\(|\bapi\.|\baxios\.|\bawait\b|supabase\s*\.',text):return 'Request / persistence: C1 / C2 as invoked'
    if 'streaming/' in a['file']:return 'Local control; connected IVS time continues C5'
    return 'Local / delegated control; dependent fetches may add usage'

for a in active:
    a['outcome']=effect(a)
    a['cost']=cost(a)
    a['screen']=human(Path(a['file']).stem)
    if a['label'] in ('button','IconButton','div','span','tr','a','input','select','textarea') or not re.search(r'[A-Za-z0-9]',a['label']) or len(a['label'])>110:
        events=[e for e in a['events'] if e['event'] not in ('onMouseDown','onFocus','onBlur')]
        h=events[0]['handler'] if events else ''
        label=human(re.sub(r'^handle','',h)) if re.fullmatch(r'[A-Za-z_$][\w$]*',h) else a['label']
        if not re.search(r'[A-Za-z0-9]',label):
            label='Submit form' if a.get('type')=='submit' else 'Dynamic / icon control'
        a['displayLabel']=(label if len(label)<105 else label[:102]+'…')+' [label depends on context]'
    else:a['displayLabel']=a['label']
    a['primary']=bool(a.get('to') or a.get('type')=='submit' or any(e['event'] not in ('onChange','onMouseDown','onFocus','onBlur','onKeyDown','onMouseEnter','onMouseLeave') for e in a['events']))

payload=json.dumps(active,ensure_ascii=False).replace('<','\\u003c')
template='''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ANU — Click-by-click action atlas</title>
<style>
:root{font:15px system-ui,sans-serif;color:#182c3b;background:#f4f7f9}*{box-sizing:border-box}body{margin:0}header{background:#153747;color:white;padding:26px 32px}h1{font-size:25px;margin:0 0 9px}header p{max-width:1050px;line-height:1.6;margin:0;color:#d5e7ef}.tools{padding:20px 28px;background:white;position:sticky;top:0;z-index:2;border-bottom:1px solid #cbd7de;display:flex;gap:12px;flex-wrap:wrap;align-items:center}select,input[type=search],button{font:inherit;border:1px solid #b3c5cf;border-radius:7px;padding:10px;background:white;color:#193b50}select{max-width:440px}input[type=search]{min-width:240px;flex:1}button{cursor:pointer}button:hover{background:#e4eff4}main{padding:24px 28px;max-width:1450px;margin:auto}.note{line-height:1.6;background:#fff5db;border-left:4px solid #b87b00;padding:14px 18px;margin-bottom:20px}.legend{line-height:1.8;margin:14px 0}#diagram{overflow:auto;background:white;border:1px solid #d5e0e6;border-radius:10px}svg text{font-family:system-ui,sans-serif}details{background:white;border:1px solid #d5e0e6;border-radius:7px;margin:10px 0;padding:12px}summary{cursor:pointer;font-weight:600}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f0f4f6;padding:12px;font-size:12px;max-height:370px;overflow:auto}.meta{color:#526978;font-size:13px;line-height:1.6}.tag{font-size:12px;background:#e6eff5;border-radius:4px;padding:3px 7px}#evidence h2{font-size:20px}.charttitle{margin-top:0}@media print{header,.tools,.note,#evidence{display:none}main{padding:0}#diagram{border:0;overflow:visible}svg{max-width:100%;height:auto}}
</style></head><body><header><h1>ANU · Click-by-click action atlas</h1><p>Choose a screen or component. Follow its screen → individual control → result branches. Use the sequential flowchart book for multi-step dialogs and success/error paths. This offline atlas includes source evidence for each extracted control.</p></header>
<div class="tools"><select id="screen" aria-label="Screen"></select><input id="search" type="search" placeholder="Find action, label or handler across the atlas" aria-label="Search actions"><label><input id="fields" type="checkbox"> Include input / decorative callbacks</label><button id="export">Save current SVG</button><button id="print">Print chart</button></div>
<main><div class="note">Static source review · 30 October 2026. Conditional controls may be hidden for your role. A control defined in source is not proof that a visible opener exists. Source-derived outcome summaries are review aids; uncertain parent callbacks and incomplete handlers are labelled. Headset button flows need the Unity/headset source.</div><h2 id="title" class="charttitle"></h2><p id="count" class="meta"></p><div class="legend">C1 API / backend · C2 database · C3 cloud files / delivery · C4 conversion compute · C5 live participant time · C6 notification delivery. Local UI changes have no independent per-click cloud tariff.</div><div id="diagram"></div><section id="evidence"></section></main>
<script id="data" type="application/json">__PAYLOAD__</script><script>
const actions=JSON.parse(document.getElementById('data').textContent);
const selector=document.getElementById('screen'), search=document.getElementById('search'), fields=document.getElementById('fields');
const files=[...new Set(actions.map(a=>a.file))].sort((a,b)=>{let x=a.includes('/Auth/')?-1:a.includes('/pages/')?0:1,y=b.includes('/Auth/')?-1:b.includes('/pages/')?0:1;return x-y||a.localeCompare(b)});
selector.add(new Option('All screens — search across actions','*'));
files.forEach(f=>selector.add(new Option(f.replace('client/src/',''),f)));selector.value='client/src/Auth/login.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function lines(t,n){let out=[],line='';for(const w of String(t).split(/\\s+/)){if((line+' '+w).trim().length>n&&line){out.push(line);line=w}else line=(line+' '+w).trim()}if(line)out.push(line);return out}
function txt(t,x,y,n,size=13){return '<text x="'+x+'" y="'+y+'" fill="#193b50" font-size="'+size+'">'+lines(t,n).map((l,i)=>'<tspan x="'+x+'" dy="'+(i?18:0)+'">'+esc(l)+'</tspan>').join('')+'</text>'}
let svgText='';
function render(){
const q=search.value.trim().toLowerCase();let rows=actions.filter(a=>(selector.value==='*'||a.file===selector.value)&&(fields.checked||a.primary)&&(!q||JSON.stringify([a.file,a.label,a.events,a.outcome]).toLowerCase().includes(q)));
document.getElementById('title').textContent=selector.value==='*'?'All matching screen actions':selector.value.replace('client/src/','');
document.getElementById('count').textContent=rows.length+' matching control definitions · '+actions.length+' reachable-source control definitions in total. Repeated data rows share one definition.';
if(!rows.length){document.getElementById('diagram').textContent='No matching actions.';document.getElementById('evidence').replaceChildren();return;}
const rowHeight=158,height=70+rows.length*rowHeight;
svgText='<svg xmlns="http://www.w3.org/2000/svg" width="1180" height="'+height+'" viewBox="0 0 1180 '+height+'" role="img" aria-label="Click action flowchart"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#6b8796"/></marker></defs><rect width="1180" height="'+height+'" fill="white"/>'+txt('SCREEN / CONTEXT',22,28,23,12)+txt('CLICK / SELECT / INPUT',250,28,35,12)+txt('RESULT / NEXT STATE',654,28,50,12);
rows.forEach((a,i)=>{const y=55+i*rowHeight,mid=y+48;svgText+='<rect x="16" y="'+y+'" width="194" height="96" rx="9" fill="#edf3f6" stroke="#c7d7e0"/>'+txt(a.screen,28,y+25,24)+txt('Source line '+a.line,28,y+76,24,11)+'<path d="M210 '+mid+' H240" stroke="#6b8796" fill="none" marker-end="url(#arrow)"/><rect x="246" y="'+y+'" width="350" height="96" rx="9" fill="#e8f3eb" stroke="#bed7c6"/>'+txt(a.displayLabel,259,y+24,44)+'<path d="M596 '+mid+' H634" stroke="#6b8796" fill="none" marker-end="url(#arrow)"/><rect x="640" y="'+y+'" width="520" height="104" rx="9" fill="#f2f5fa" stroke="#c7d7e0"/>'+txt(a.outcome,653,y+23,69)+txt(a.cost,653,y+126,70,11)});
svgText+='</svg>';document.getElementById('diagram').innerHTML=svgText;
const evidence=document.getElementById('evidence');evidence.innerHTML='<h2>Control evidence and visibility conditions</h2>';
rows.forEach(a=>{const d=document.createElement('details');const s=document.createElement('summary');s.textContent=a.displayLabel+' · '+a.file+':'+a.line;d.append(s);const p=document.createElement('p');p.className='meta';p.textContent='Disabled: '+(a.disabled||'no explicit disabled prop')+' | Conditions: '+(a.conditions.join(' ; ')||'see parent screen / role gate')+' | Events: '+(a.events.map(e=>e.event).join(', ')||'native / navigation');d.append(p);for(const e of a.events){const pre=document.createElement('pre');pre.textContent=e.event+' → '+e.handler+'\\n\\n'+e.expanded;d.append(pre)}evidence.append(d)});
}
selector.addEventListener('change',render);search.addEventListener('input',render);fields.addEventListener('change',render);
document.getElementById('print').addEventListener('click',()=>window.print());document.getElementById('export').addEventListener('click',()=>{if(!svgText)return;const u=URL.createObjectURL(new Blob([svgText],{type:'image/svg+xml'}));const a=document.createElement('a');a.href=u;a.download='anu-click-actions.svg';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)});render();
</script></body></html>'''
(ROOT/'ANU_CLICK_ACTION_ATLAS.html').write_text(template.replace('__PAYLOAD__',payload),encoding='utf-8')
print(json.dumps({'sequential_charts':len(sections),'reachable_controls':len(active),'primary_actions':sum(a['primary'] for a in active),'source_files':len(set(a['file'] for a in active)),'atlas_bytes':(ROOT/'ANU_CLICK_ACTION_ATLAS.html').stat().st_size}))
