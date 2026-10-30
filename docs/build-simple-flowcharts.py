from pathlib import Path
import json, html

ROOT = Path(__file__).resolve().parent
flows=[]
def add(group,title,steps,branches=None,cost='',note=''):
    flows.append(dict(group=group,title=title,steps=steps,branches=branches or [],cost=cost,note=note))

add('Login','Sign in',[
 'Open the application → Login screen appears','Click Email address → Type your email','Click Password → Type your password','Click “Sign in to LMS”','Your details are checked','Correct details → Your dashboard opens'],
 [[2,'Click the eye icon','Password becomes visible. Click it again to hide it.'],[4,'A field is empty','“Please fill all the fields” appears. Fill the missing field and click Sign in again.'],[4,'Email or password is wrong','“Invalid credentials” appears. Correct your details and click Sign in again.']],
 'At Sign in: the cloud checks your account and saves the login session. Cost comes from the number of checks and the time the server runs.')
add('Login','Forgot password',[
 'On Login, click “Forgot password?”','A “Reset password” window opens','Click Email address → Enter your registered email','Click “Reset Password”','A request is sent and an email is attempted','A message appears → The window closes → Login is visible again'],
 [[1,'Click Cancel, X, or outside the window','The window closes. You return to Login.'],[3,'Email field is empty','An error appears. Enter your email and try again.']],
 'At Reset Password: the cloud records the request and sends an email. Charges depend on server usage and the email provider.',
 'Needs completion: the current email contains placeholder text. A working reset link, new-password screen and phone-based password recovery are not completed in this flow.')
add('Login','Verify an account / resend OTP',[
 'On Login, click “Verify account / resend OTP”','Enter the account email','Choose “New account activation” or “Account reactivation”','Click “Send OTP”','A six-digit code is sent to the registered phone → An OTP box appears','Enter the six-digit code → Click “Verify account”','“Account verified. You can now sign in.” appears','Use the browser Back button to return to Login → Sign in'],
 [[4,'Did not receive the code?','Click Resend OTP. A new sending attempt is made.'],[5,'Code is wrong or expired','An error appears. Enter a valid code or request another one.']],
 'At Send / Resend OTP: notification-provider charges may apply. At Verify account: the saved account is checked and updated.',
 'This verifies account activation/reactivation. It is separate from resetting a forgotten password.')
add('Common controls','Open another screen',[
 'Look at the menu on the left','Click a screen name, such as Trainees, Batch, or Volumes','That screen opens','Click the ANU logo or Dashboard to return to your dashboard'],
 [[0,'Menu is collapsed','Click the chevron arrow to expand it. Click again to collapse it.']],
 'Changing the menu itself is local. Opening a screen may read saved cloud data.',
 'The visible menu depends on whether you are a trainee, instructor, institution admin or super admin.')
add('Common controls','Notifications',[
 'Click the bell at the top','The notification list opens','Click “View” beside a notification','The related screen opens'],
 [[1,'Click Mark as read','That notification becomes read.'],[1,'Click Mark all read','All listed unread notifications become read.'],[1,'Click the bell again / outside the menu','The notification menu closes.']],
 'Reading or updating saved notifications uses cloud data. It does not upload headset video.')
add('Common controls','View profile / manage sessions / log out',[
 'Click your user menu at the top','Click “Profile”','Your saved profile appears','Click Close / X to close the profile'],
 [[0,'Click Sessions instead','The device-session screen opens. See “Log out a device”.'],[0,'Click Logout instead','Your current session ends. The Login screen opens.']],
 'Opening a profile may read saved cloud data. Logout updates your saved session.')
add('Common controls','Fullscreen, table pages and search',[
 'Click the fullscreen icon → The browser enters fullscreen','Click it again → Normal view returns','In a table, click Next / Previous or a page number → Another page of rows appears','Change rows per page, where shown → More or fewer rows appear','Click Search → Type a name or term → Matching rows appear'],
 cost='Fullscreen is local. Table/search controls may work on already-loaded rows or request another set of cloud data, depending on the screen.')

add('Dashboards','Use your dashboard',[
 'Sign in → Your role-specific dashboard opens','Admin: click Overview or Users → The selected panel appears','Admin: click Trainees, Instructors or Batches → That list opens','Super admin: click Institutions, Students, Instructors or Courses → That list opens','Super admin: click Global Activity Tracking or Active Users → That panel appears','Super admin: click Refresh Now → The latest activity is loaded','Instructor: click Add Course → The custom-course screen opens'],
 cost='Dashboard data and refreshes read saved cloud information. Switching a panel may use information already loaded.',
 note='These are separate role-specific choices. One person will not see all of them.')
add('Trainees and instructors','Add a trainee — personal details',[
 'Click “Trainees” in the left menu','Click “Add trainee”','The “Basic” step opens','Enter Full Name, Email address, Contact Number and Institution Name','Choose Date of Birth and Gender','Click Select Batch → Choose the trainee’s batch','Click Next → The “Credentials” step opens'],
 cost='The batch choices are read from saved data. Typing these details does not save the trainee yet.')
add('Trainees and instructors','Add a trainee — password, photo and save',[
 'In Credentials, enter Password and Confirm password','Choose Active or Inactive status','Click Next → “Profile & Meta Info” opens','Click “Upload File” → Choose a photograph','Click Submit','The account details and photograph are sent to the cloud','Success message appears → The trainee list opens'],
 [[1,'Need to change personal details?','Click Prev to return to Basic.'],[3,'Need to change credentials?','Click Prev to return to Credentials.'],[4,'Passwords do not match','An error appears. Return to Credentials and correct them.'],[5,'Email already exists / required information is missing','An error appears. Correct the information before submitting again.']],
 'At Submit: account details are stored in the database; the photo is sent with the form. File storage and verification-message costs depend on the server path used.')
add('Trainees and instructors','Add an instructor',[
 'Click “Instructors”','Click “Add Instructor”','Enter personal details in Basic','Click Select Batches → Choose the instructor’s batches','Click Next → Enter password, confirmation and status','Click Next → Click Upload File → Choose photograph','Click Submit → On success, the instructor list opens'],
 [[4,'Need to go back?','Click Prev to return to the earlier step.'],[6,'The form is rejected','Read the error, correct the details and submit again.']],
 'At Submit: cloud account creation, submitted photo handling and any verification message may incur usage.')
add('Trainees and instructors','View or edit a trainee',[
 'Click Trainees','Find the trainee using Search or the table pages','Click the trainee’s name / View → Their dashboard opens'],
 [[1,'To edit instead','Click Edit → Change the displayed fields / batch → Click Submit → On success, the list refreshes.'],[1,'Close the edit window without saving','Click X or close the dialog. You return to the list.']],
 'View reads saved results. Submit saves account changes in the cloud.')
add('Trainees and instructors','Enable, disable or delete a trainee',[
 'Open Trainees → Find the trainee','Click Enable, Disable or Delete for that trainee','A confirmation message appears','Click Okay to continue','The selected operation runs → The list is refreshed or a result is shown'],
 [[2,'Click Cancel','The operation is cancelled. The account stays as it was.'],[3,'You selected Enable','A verification OTP is sent. The trainee must verify the account to complete activation.'],[4,'The request fails','An error appears. Check the result before trying again.']],
 'At Okay: the saved account is updated or deleted. Enable may also send a paid verification message.')
add('Trainees and instructors','View, edit or delete an instructor',[
 'Click Instructors → Find the instructor','Click the instructor’s name → Their profile opens','Click a batch link → That batch profile opens'],
 [[0,'See assigned batch names in the list','Click the batch expander. Click it again to collapse the names.'],[0,'Edit the instructor','Click Edit → Change the form → Click Submit → The list refreshes on success.'],[0,'Delete the instructor','Click Delete → Click Okay in the confirmation. Click Cancel to keep the account.']],
 'Viewing reads cloud information. Saving or confirming deletion changes saved account data.')

add('Batches and schedules','Create a batch',[
 'Click Batch','Select the Batch List tab','Click Create Batch','Enter the batch name and dates','Select the curriculum → Then select the certificate','Click Save','On success, the window closes and the batch list refreshes'],
 [[5,'Required details are missing / the batch already exists','An error appears. Correct the form and click Save again.'],[2,'Decide not to create it','Click X or outside the window.']],
 'At Save: batch information is stored in the cloud. Curriculum and certificate choices also read saved data.')
add('Batches and schedules','Find, open, edit or delete a batch',[
 'Click Batch → Batch List','Click a batch name → The batch profile opens','Click Home → Dashboard opens'],
 [[0,'Filter batches','Click the filter icon → Choose at least one filter → Click Apply → Matching batches appear.'],[0,'Edit a batch','Open its row menu → Click Edit → Change name / dates → Click Update.'],[0,'Cancel an edit','Click Close.'],[0,'Delete a batch','Open its row menu → Click Delete → Click Okay to delete or Cancel to keep it.']],
 'Opening/filtering reads cloud data. Update and confirmed deletion change saved batch data.',
 'Some sort icons in the batch profile have no sorting action connected.')
add('Batches and schedules','Create targeted learning',[
 'Click Batch → Click Targeted Learning','Click the create icon','Choose curriculum → Certificate → Learning modules','Choose resource type → Select resources','Complete the displayed learner and date selections','Click Initiate','On success, the window closes and the groups refresh'],
 [[5,'Information is missing','An error appears. Complete the form and click Initiate again.'],[1,'Cancel creation','Click X or outside the window.']],
 'Choices read saved cloud data. Initiate stores the targeted learning assignment.')
add('Batches and schedules','Open or delete targeted learning',[
 'Click Batch → Targeted Learning','Click the group name or View → Its profile opens'],
 [[0,'Delete a group','Open its row menu → Delete → Okay. Choose Cancel to keep it.']],
 'Opening reads saved group information. Confirmed deletion removes the saved assignment.')
add('Batches and schedules','Use the schedule',[
 'Click Schedules','Click Month or Week → The calendar view changes','Click Previous or Next → Another period appears','Click Today → The calendar returns to today','Click an event, or an item in Upcoming activity','The related batch profile opens'],
 cost='Loading schedules and opening the batch read saved cloud data. Moving the displayed calendar period is a view action.')

add('Courses and learning content','Create a curriculum',[
 'Super admin: click Curriculum','Click Create curriculum','Enter the curriculum details','Click Save curriculum','The saved curriculum appears when the list refreshes'],
 [[1,'Cancel','Click Close / X or outside the window.'],[3,'Saving fails','Correct the information and try again.']],
 'At Save curriculum: the new curriculum is written to cloud data.')
add('Courses and learning content','Use a curriculum’s menu',[
 'Click Curriculum','Open the Actions menu for a curriculum','Click View or Add course → The Certifications list opens'],
 [[1,'Click Tag trainees','The Trainees list opens.'],[1,'Click Tag instructors','The Instructors list opens.'],[1,'Click Delete','A confirmation appears. Okay deletes it; Cancel keeps it.']],
 'Opening lists reads saved data. Confirming Delete changes cloud data.')
add('Courses and learning content','Create, open or delete a certification',[
 'Click Certifications','Click Add Course','Enter the name and choose the curriculum','Click Save','The certification list refreshes','Click a certification name or View → Its learning modules open'],
 [[1,'Cancel creation','Click X / outside the window.'],[0,'Expand a list row','Click its arrow / expandable label; click again to collapse it.'],[0,'Delete a certification','Open the row menu → Delete → Okay. Choose Cancel to keep it.'],[0,'Tag a course','Open the row menu → Tag Course → Choose associations → Save.']],
 'Save, Tag Course and confirmed Delete change saved cloud data. Opening a certification reads its content.')
add('Courses and learning content','Open modules, topics and resources',[
 'Open a certification','Click the arrow beside a learning module','The module’s resource categories appear','Click a category → Its resources appear','If a topic is grouped, click its arrow → Its resources appear','Click a resource row → A learner-completion window opens','Click View Profile beside a learner → Their dashboard opens'],
 [[1,'Hide the module again','Click the same arrow.'],[3,'Hide a category / topic','Click its arrow again.'],[5,'Return to the resources','Click X or outside the completion window.']],
 'Opening content or learner-completion details reads saved cloud data. Expand / collapse actions themselves are local.')
add('Courses and learning content','Create a learning module',[
 'Open a certification','Click the add learning-module icon','Choose the certification and complete the course, module and unit fields','Click Create','On success, the new learning module is available in the refreshed view'],
 [[1,'Cancel','Click X / outside the window.'],[3,'Creation fails','Correct the form and try again.']],
 'At Create: learning-module information is stored in the cloud.')
add('Courses and learning content','Create a resource',[
 'Open a certification → Expand its learning module','Click the add-resource icon','Choose the resource type','Complete the fields shown for that resource type','Click Create','On success, the resource list refreshes'],
 [[1,'Cancel','Click X / outside the window.'],[4,'Creation fails','Correct the information and click Create again.']],
 'At Create: the resource details are stored in the cloud.')
add('Courses and learning content','Attach a volume to a resource',[
 'Open the certification → Expand the module and resource category','Click Attach Volume beside the resource','Select Volume Name','The available Shadow Recording and Step Recording choices load','Choose the applicable recordings','Click Attach','On success, the window closes and the volume is linked to the resource'],
 [[1,'Cancel','Click Cancel / X or outside the window.'],[5,'Attachment fails','An error appears. Correct the selections and try again.']],
 'Selecting a volume reads recording information. Attach saves the link. It does not upload the whole volume again.')
add('Courses and learning content','Add or edit questions',[
 'Click the question-editor icon beside the resource','Choose the question type and enter its number / prompt','Complete the fields shown for that question type','Click Add Option or Add Step to add a row','Enter the option / step details and choose the correct answer where applicable','Click Add Question to add another question','Click Save Questions → The configured questions are saved'],
 [[2,'Add an image','Use the image file selector, where shown, or enter its image address.'],[3,'Remove an option / step','Click its remove icon.'],[5,'Remove a question','Click that question’s delete icon.'],[0,'Close the editor','Click X / close the dialog.'],[6,'Validation or saving fails','Read the error, correct the fields and save again.']],
 'Save Questions stores question data. Uploading an image adds file-storage usage. Merely adding/removing an unsaved form row is local.')
add('Courses and learning content','Alternate Chapter → Module → Resource screens',[
 'On Chapters, click a chapter → Its modules appear','On Modules, click a module → Its resources appear','Click the add icon on the relevant screen','Enter the chapter, module or resource details','Click Save → The corresponding creation request runs'],
 [[2,'Cancel','Click X / close.'],[1,'Edit resource questions','Click the question icon beside the resource.']],
 'Save stores the corresponding content record.',
 'The old Course breadcrumb points to an unregistered destination. The current source can send the user back to Login through that link.')

add('Course access','Create and publish an accessible course',[
 'Open Content Access','Click Create course','Complete the course form → Click Create draft','The new course appears as a draft','Click Publish beside that course','The course state changes and the list reloads'],
 [[1,'Cancel creation','Click the close control.'],[3,'Unpublish an existing course','Click Unpublish. The course returns to draft.'],[3,'Archive an existing course','Click Archive.']],
 'Create draft and changing the publication state update cloud data.',
 'Only users with the relevant permissions see these controls.')
add('Course access','Choose who can see or use a course',[
 'Open Content Access → Find the course','Change its institution-visibility choices','Click Save visibility → The institution access is saved','Click Assignments → The assignment window opens','Choose the displayed batches / users','Click Save assignments','On success, the assignment window closes'],
 [[3,'Cancel assignments','Click the close control.'],[0,'Open the course instead','Click Open → Its certification details appear.']],
 'Save visibility and Save assignments store access rules in the cloud.')
add('Course access','Add administrators and review older content',[
 'Open the permitted administrator section in Content Access','To add an institution admin: choose the institution → Fill details → Click Add','To add a super admin: fill the super-admin form → Click Add Super Admin','Returned account information appears → Click Dismiss to hide it','For content awaiting review: choose Global core, Global specialized or Set institution','For an older mapping: click the applicable Migrate choice'],
 cost='Creating accounts and assigning ownership update cloud data. A verification message may add notification charges.',
 note='These controls are restricted by role. Ownership/migration actions apply to existing content requiring review, not to an ordinary learner.')

add('Volumes and recordings','Upload a volume — enter details',[
 'Click Volumes','Click Upload Volume','Enter Volume Name and Anatomy Type','Choose Fetal Presentation and Trimester','Enter Gestational Age and Case Details','Check the displayed Uploader Name','Click the file-selection area → Your computer’s file picker opens'],
 [[1,'Cancel','Click X / outside the upload window.']],
 'No volume file is sent merely by opening this window or typing metadata.')
add('Volumes and recordings','Upload a volume — choose files and send',[
 'In the file picker, choose the .vol file or files','The selected files appear in the upload window','Click Upload','The files are sent to cloud storage; their details are saved','A success / upload-result message appears','On success, the window closes and the volume list refreshes'],
 [[1,'Wrong file selected','Click Remove file beside it → Select the correct file.'],[2,'Required details or files are missing','An error appears. Complete the form and click Upload again.'],[3,'A file fails to upload','Inspect the upload result before retrying, so already-uploaded files are not blindly sent again.']],
 'At Upload: file capacity, upload requests and server processing are chargeable dimensions. Keeping the file in storage adds a monthly storage charge.',
 'The file picker allows up to ten .vol files. The backend also applies its configured file-size limit.')
add('Volumes and recordings','Filter, edit or convert a volume',[
 'Click Volumes','Type in Search or choose the anatomy / approval / conversion filters','Matching volume rows appear','Open the selected volume’s row menu','Click Edit → Change details → Click Save Changes','Or click the conversion action → “Conversion Started” appears if accepted'],
 [[4,'Cancel editing','Click Cancel / X.'],[4,'Saving fails','Read the error, correct the form and save again.'],[5,'Conversion request fails','An error appears. Check the volume state before retrying.']],
 'Save Changes updates saved metadata. Starting conversion runs a cloud computer and creates a converted file, so compute time and new file storage are charged.')
add('Volumes and recordings','Download a volume or placement file',[
 'Click Volumes → Find the volume','Click Source file, Converted file or Download JSON file','Permission and file availability are checked','The download starts from cloud storage','The file is saved by your browser'],
 [[2,'File is unavailable / access is denied','An error appears. The download does not complete.']],
 'At download: file-read requests and data sent from the cloud may be billed. More downloads mean more delivered data.')
add('Volumes and recordings','Upload placement information',[
 'Click Volumes → Find the volume','Use that row’s placement-JSON file selector','Choose the JSON file','The file extension and JSON contents are checked','If valid, the placement file is uploaded and linked to the volume'],
 [[3,'The file is not valid JSON','An error appears. Choose a corrected JSON file.']],
 'At upload: the placement file is stored in the cloud and its saved volume link is updated.')
add('Volumes and recordings','Download reference recordings',[
 'Click Volumes → Find the volume','Click Recording files','The recording-download window opens','Click the required recording, audio, image or Manifest file','The selected file downloads'],
 [[2,'Return without downloading','Click X / outside the window.'],[3,'File preparation fails','An error appears. Check file availability and retry.']],
 'Opening the list reads saved recording information. Each file download adds file requests and possible outbound-data charges.')
add('Volumes and recordings','Approve or reject an uploaded volume',[
 'Open the Request-raised screen when available through the application','Find the pending volume','Click Approve to approve it','Or click Reject to reject it','The approval decision is saved'],
 cost='Approve / Reject updates the saved approval status. It does not itself run conversion or transfer the full file.')
add('Volumes and recordings','Manage a cluster',[
 'Click Cluster','Type in Search clusters → Matching rows appear','Click Edit Cluster beside a row','Change the name, fetal presentation or selected volumes','Click Save Changes','The displayed cluster list / local saved copy updates'],
 [[2,'Cancel editing','Click Cancel / X.'],[1,'Delete a cluster','Click Delete Cluster → The deletion path runs and the displayed list updates.']],
 'A successful cloud update uses database requests. The current page also has a local fallback, so a changed list does not always prove the cloud save succeeded.',
 'Add-cluster and recording-upload windows exist in the source, but their opening buttons are absent from the currently reviewed table/header. They should not be shown as available clicks.')
add('Volumes and recordings','Recording-upload window — if made accessible',[
 'Open the recording-upload window through a confirmed entry point','Select the volume and enter the recording name','Choose the recording JSON, audio, images and manifest files','Click Upload Recording','On success, the window closes and recording counts update'],
 [[1,'Replace an existing recording instead','Click Replace Existing Recording → Choose the existing recording → Choose replacement files → Click Replace Recording Files.'],[2,'Cancel','Click Cancel / X while no upload is running.'],[3,'Files are missing or rejected','Read the error and correct the selected files.']],
 'Upload / Replace sends file data to cloud storage and updates recording records.',
 'This is a defined window with an unconfirmed opening click, not a complete reachable user journey in the reviewed screen.')

add('Mapping and reattempts','Create a course mapping',[
 'Super admin: click Course Mapping','Choose Volume → Trimester → Module → Unit → Course Type','Choose Shadow Recording and Step Recording where applicable','Click Create Mapping','On success, the form clears and the mappings reload'],
 [[1,'Start the form again','Click the form’s Clear button.'],[3,'A required choice is missing / saving fails','Read the error and correct the form.'],[4,'Find existing mappings','Set list filters → Click Apply or Refresh. Click the filter Clear to reset them.']],
 'Create Mapping stores links between existing content. It does not resend the whole volume file.')
add('Mapping and reattempts','Create a custom course',[
 'Instructor: click SVT Course, or click Add Course from the dashboard','On the custom-course page, click Add Course','Enter course name, description and doctor name','Select volume and course type → Choose available reference recordings','Click Create Course','On success, the dialog closes'],
 [[2,'Start the form again','Click Clear.'],[1,'Cancel','Click X / outside the window.'],[0,'Return to dashboard','Click Back.'],[4,'Required details or volume trimester are missing','An error appears. Correct the form and retry.']],
 'Create Course stores the course mapping and metadata; existing volume files are reused.')
add('Mapping and reattempts','Set reattempt options',[
 'Super admin: click Reattempts','Choose Certificate → Course → Unit → Resource','Complete the displayed reattempt values','Click Save','The configuration is saved'],
 [[1,'Reset the form','Click Clear.'],[4,'Find saved settings','Choose list filters → Apply or Refresh. Click Clear Filters to reset the list.']],
 'Save updates cloud configuration. Apply / Refresh reads existing configuration.')

add('Trainee learning','Choose what to view in My Learning',[
 'Trainee: click My Learning','Click a certification tab','Click the required module','Choose an activity filter, or type in Search','Click a topic heading / arrow','The topic’s resources appear'],
 [[2,'The module is locked','The current module stays selected.'],[4,'Hide the topic','Click the topic heading / arrow again.']],
 'The screen reads saved learning information. Most tab, filter and expand controls update the local view.')
add('Trainee learning','View questions, scores and attempt details',[
 'Open My Learning → Select the certification and module','Find the resource','For MindSpark, click View Questions → Its configured questions appear','Click Close / X → Return to My Learning','Click Score to see the recorded attempts / scores','For supported practice or test resources, click View to see attempt details','Inside the details, select a tab or expand an attempt to read more','Click Close / X / outside the window to return'],
 [[1,'Image interpretation','Click the interpretation resource row → Its interpretation details appear.'],[5,'Open a submitted or reference image','Click View submitted image, User image or Expert image where shown.']],
 'Viewing attempts reads stored results. Opening an image can deliver a file from cloud storage, adding read / outbound-data usage.',
 'These controls display existing questions and results. They are not a web button to start the headset simulation.')
add('Trainee learning','View progress',[
 'Open My Progress if available through navigation / its saved link','Click the required certification tab','The displayed progress changes to that certification'],
 cost='Progress data is read from the cloud. Tab selection may reuse information already loaded.',
 note='My Progress has a registered screen, but is not shown in the current trainee sidebar.')
add('Trainee learning','Send and manage a query',[
 'Click Queries','Click Create Query','Choose the query type and enter the query text','Click Submit','On success, the query list refreshes'],
 [[1,'Cancel','Click X / outside the dialog.'],[4,'Mark a query resolved, where permitted','Open its row menu → Click Mark as Resolved.'],[4,'Delete a query, where permitted','Open its row menu → Click Delete.'],[4,'Click View in the current query menu','Only the menu closes; a query-detail screen is not opened by this handler.']],
 'Submit, Resolve and Delete change saved query information.')

add('Headset and live view','Watch your own headset stream',[
 'Sign in as a trainee','Click Streams','The page checks for your headset’s published stream','If available, your live headset view appears','Click Enable audio / Mute audio to change preview sound','If Reconnect preview is shown, click it to retry the connection'],
 [[2,'Headset is not publishing','A waiting / unavailable message appears. Start publishing on the headset using its own controls.']],
 'While connected: live-video participant time is billed. India’s first-tier video rate is $0.092 per connected participant-hour. The headset publisher and browser viewer each add connection time.',
 'The exact headset clicks to start publishing cannot be confirmed without the Unity/headset project.')
add('Headset and live view','Admin watches a trainee’s headset',[
 'Sign in as an institution admin','Click Streams','The institution’s live-stream page opens','Click the LIVE tile for the required trainee','That trainee’s live view is selected'],
 cost='While viewing: live participant time is billed. The trainee’s stream is also copied to the institution’s live stage; that usage must be included when calculating the full cloud bill.',
 note='Live viewing does not automatically mean the video is saved as a recording.')
add('Headset and live view','Where headset files and results travel',[
 'Headset user selects an available learning activity — exact headset button needs confirmation','Headset asks the LMS for the authorized scenario','Cloud storage sends the required volume and reference files to the headset','The learner performs the activity in the headset','Headset sends the result and any submitted image to the LMS','The result is stored; submitted image files are stored where applicable','The LMS later reads those results for progress / attempt views'],
 cost='At download: file reads and delivered data. At submission: server/database usage and image storage. During live viewing: separate live-participant charges.',
 note='This shows the data journey. The local project does not establish every screen or button inside the headset.')

add('Device sessions','Log out a device',[
 'Click your user menu → Sessions','If permitted, search for a user and select them; otherwise view your own sessions','Find the active device session','Click Logout beside that session','A browser confirmation appears → Click OK','The selected session ends and the list refreshes'],
 [[4,'Click Cancel','The session stays active.'],[5,'You ended your current session','The Login screen opens.'],[2,'Log out every session instead','Click Logout all sessions → Confirm OK. Click Cancel to keep them.']],
 'Confirmation updates saved login sessions. A background session check also runs regularly while the app is open.')
add('Institutions and reports','Onboard a scan center',[
 'Super admin: click Academics','Click Onboard Scan Center','Enter the required scan-center information','Click Onboard Scan Center in the window','On success, a confirmation appears and the center list refreshes'],
 [[1,'Cancel','Click Cancel / X.'],[3,'Information is missing / the request fails','An error appears. Correct the form and try again.']],
 'At Onboard: institution/account data is saved. Configured account notifications can add delivery costs.')
add('Institutions and reports','Filter or inspect scan-center actions',[
 'Click Academics','Click the filter icon','Choose the displayed filter values','Click Apply → Matching loaded centers appear','Click Clear to reset the filters'],
 [[1,'Close the filter','Click X / close.'],[0,'Row menu → View Details','Current action does not open a detail page.'],[0,'Row menu → Edit','An edit window opens. Update currently lacks an active cloud-saving call.'],[0,'Row menu → Delete','A confirmation appears. The current delete action lacks an active cloud-delete call.']],
 'Filtering the already-loaded centers is local. The unfinished edit/delete controls do not establish a saved cloud change.',
 'A success message from the unfinished controls should not be treated as proof that a center was changed or deleted.')
add('Institutions and reports','Reports screen',[
 'Open Reports if available through a saved link / navigation','Use the date controls that have active handlers','The selected date values change'],
 cost='Opening reports may read saved information.',
 note='Some visible report/filter buttons have no connected action. A working report-generation flow cannot be claimed from those buttons.')

intro='''# ANU — Easy-to-read click flowcharts

Each box says what you click and what you see next. Side branches explain mistakes, Cancel and other choices. Read one task at a time.

These flows follow the current project source. Features that are unfinished or cannot be confirmed are labelled. Menus and available buttons depend on your account role.

Cloud notes describe where charges arise. They are not a fixed price for each click. The earlier cloud-cost guide contains the billing formulas and sources.

'''
md=intro
for i,f in enumerate(flows,1):
    md+=f'## {i}. {f["title"]}\n\n```mermaid\nflowchart TD\n'
    for j,s in enumerate(f['steps']):
        # Mermaid's quoted node labels safely preserve visible punctuation.
        safe=s.replace('"','&quot;')
        md+=f'    S{j}["{safe}"]\n'
        if j:md+=f'    S{j-1} --> S{j}\n'
    for j,(step,label,result) in enumerate(f['branches']):
        md+=f'    S{step} -->|"{label.replace(chr(34), "&quot;")}"| B{j}["{result.replace(chr(34), "&quot;")}"]\n'
    md+='```\n\n'
    if f['cost']:md+='**Cloud cost here:** '+f['cost']+'\n\n'
    if f['note']:md+='**Current project note:** '+f['note']+'\n\n'
md+='Pricing reference: [Amazon IVS](https://aws.amazon.com/ivs/pricing/). All amounts are USD before tax, discounts and allowances. Full cost depends on actual usage.\n'
(ROOT/'ANU_SIMPLE_CLICK_FLOWCHARTS.md').write_text(md,encoding='utf-8')

payload=json.dumps(flows,ensure_ascii=False).replace('<','\\u003c')
page='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ANU — Simple click flowcharts</title><style>
*{box-sizing:border-box}body{margin:0;background:#f3f6f8;color:#183746;font:16px/1.55 system-ui,sans-serif}header{background:#173e50;color:white;padding:26px 32px}h1{font-size:27px;margin:0 0 8px}header p{margin:0;max-width:900px;color:#e0edf2}nav{position:sticky;top:0;z-index:2;background:white;border-bottom:1px solid #cbd7dd;padding:16px 28px;display:flex;gap:10px;flex-wrap:wrap}select,input,button{padding:11px;border:1px solid #b6c8d1;border-radius:7px;font:inherit;background:white;color:#183746}select{max-width:460px}input{flex:1;min-width:220px}button{cursor:pointer}main{max-width:1050px;margin:auto;padding:26px 24px}.intro{margin:0 0 22px;color:#496575}article{background:white;border:1px solid #d4e0e6;border-radius:12px;padding:26px 30px;margin:0 0 24px;break-before:page}.group{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#426476}h2{font-size:24px;margin:6px 0 22px}.row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.8fr);column-gap:32px;align-items:start}.step{position:relative;border:1px solid #bcd1dc;border-radius:9px;padding:14px 16px 14px 49px;min-height:60px;background:#f1f7fa}.number{position:absolute;left:13px;top:15px;width:24px;height:24px;border-radius:50%;background:#1c526c;color:white;font-size:13px;display:flex;align-items:center;justify-content:center}.down{margin:2px 0 2px;text-align:center;width:55%;font-size:25px;line-height:1.2;color:#65899b}.alternatives{display:grid;gap:8px}.branch{background:#fff6df;border-left:3px solid #b6892b;padding:10px 13px;font-size:14px;position:relative}.branch:before{content:'→';position:absolute;left:-27px;color:#9a771f;font-size:22px;top:7px}.branch strong{display:block;margin-bottom:4px}.cost{background:#eaf5ec;padding:15px 17px;border-radius:8px;margin-top:22px}.note{background:#fff6df;padding:14px 17px;border-radius:8px;margin-top:12px}footer{font-size:13px;color:#496575;padding:0 28px 28px;max-width:1050px;margin:auto}a{color:#165e83}.empty{padding:30px} @media(max-width:680px){header{padding:22px}nav{padding:12px}.row{grid-template-columns:1fr;gap:9px}.alternatives{margin:0 0 12px 30px}.branch:before{display:none}.down{width:100%}article{padding:20px 16px}main{padding:18px 12px}}@media print{header,nav,.intro,footer{display:none}body{background:white;font-size:12px}main{padding:0;max-width:none}article{border:0;border-radius:0;padding:8px;margin:0;break-before:page}article:first-of-type{break-before:auto}.step{break-inside:avoid}.row{break-inside:avoid}h2{font-size:22px}.cost,.note{break-inside:avoid}h2{break-after:avoid}}
</style></head><body><header><h1>ANU — What do I click next?</h1><p>One task at a time. Follow the numbered boxes. Yellow branches show other choices, errors and ways to go back.</p></header><nav><select id="group" aria-label="Choose a section"><option value="">All sections</option></select><input id="search" type="search" placeholder="Find a task, e.g. upload volume or forgot password" aria-label="Find a task"><button id="print">Print / Save as PDF</button></nav><main><p class="intro">Each box shows <strong>your action → what happens next</strong>. Green notes explain cloud charges. “Current project note” marks incomplete features. Only buttons permitted for your account will be visible.</p><div id="flows"></div></main><footer>Based on the project source reviewed on 30 October 2026. Headset button names require its Unity project. India live-video reference rate: <a href="https://aws.amazon.com/ivs/pricing/">Amazon IVS pricing</a>. Exact total cost depends on usage, region, discounts and allowances.</footer><script id="data" type="application/json">__DATA__</script><script>
const flows=JSON.parse(document.getElementById('data').textContent),group=document.getElementById('group'),search=document.getElementById('search');
for(const g of [...new Set(flows.map(f=>f.group))])group.add(new Option(g,g));
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(){const q=search.value.toLowerCase().trim();let result='';for(let i=0;i<flows.length;i++){const f=flows[i];if(group.value&&f.group!==group.value)continue;if(q&&!JSON.stringify(f).toLowerCase().includes(q))continue;result+='<article><div class="group">'+esc(f.group)+'</div><h2>'+esc(f.title)+'</h2>';f.steps.forEach((s,j)=>{result+='<div class="row"><div class="step"><span class="number">'+(j+1)+'</span>'+esc(s)+'</div><div class="alternatives">'+f.branches.filter(b=>b[0]===j).map(b=>'<div class="branch"><strong>'+esc(b[1])+'</strong>'+esc(b[2])+'</div>').join('')+'</div></div>';if(j<f.steps.length-1)result+='<div class="down" aria-hidden="true">↓</div>'});if(f.cost)result+='<div class="cost"><strong>Cloud cost here</strong><br>'+esc(f.cost)+'</div>';if(f.note)result+='<div class="note"><strong>Current project note</strong><br>'+esc(f.note)+'</div>';result+='</article>'}document.getElementById('flows').innerHTML=result||'<div class="empty">No matching task. Try another word.</div>'}
group.addEventListener('change',render);search.addEventListener('input',render);document.getElementById('print').addEventListener('click',()=>window.print());render();
</script></body></html>'''
(ROOT/'ANU_SIMPLE_CLICK_FLOWCHARTS.html').write_text(page.replace('__DATA__',payload),encoding='utf-8')
print(json.dumps({'tasks':len(flows),'sections':len(set(f['group'] for f in flows)),'files':['ANU_SIMPLE_CLICK_FLOWCHARTS.html','ANU_SIMPLE_CLICK_FLOWCHARTS.md']}))
