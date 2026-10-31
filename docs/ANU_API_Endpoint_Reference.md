# ANU API endpoint reference

194 main LMS routes and 49 Medica companion routes. Fields are observed inputs, not a full validation schema.

## Main LMS

### GET /health

Check whether the service responds.

Access: No shared bearer middleware

No named request fields identified in the traced handler.
Observed status codes: 200
Source: server/v1/app.js:129

### GET /test

Return authenticated test-route and user information.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 401
Source: server/v1/app.js:172

### POST /api/v1/login

Sign in and receive tokens plus account and device context.

Access: No shared bearer middleware

Body: email, password, user_email, user_mail, user_password
Observed status codes: 200, 400, 401, 404, 500
Source: Auth.js:5

### POST /api/v1/forgot-password

Record a password-recovery request and attempt an email.

Access: No shared bearer middleware

Body: reset_password_mail
Observed status codes: 200, 400, 404, 500
Source: forgotpRoute.js:5

### POST /api/v1/account-verification/request

Request an activation or reactivation phone OTP.

Access: No shared bearer middleware

Body: email, purpose
Observed status codes: 400
Source: accountVerificationRoute.js:5

### POST /api/v1/account-verification/verify

Verify an account activation or reactivation OTP.

Access: No shared bearer middleware

Body: email, otp, purpose
Observed status codes: 400, 500
Source: accountVerificationRoute.js:6

### POST /api/v1/refresh-token

Issue a new access token using the refresh-token cookie.

Access: Refresh-token cookie / handler check

No named request fields identified in the traced handler.
Observed status codes: 401, 500
Source: refreshTokenRouter.js:5

### GET /api/v1/sessions/validate

Retrieve sessions validate.

Access: Bearer token

No named request fields identified in the traced handler.
Status / payload follows handler and shared error handling.
Source: sessionRoute.js:13

### GET /api/v1/sessions/me

Retrieve sessions me.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 403, 404
Source: sessionRoute.js:37

### GET /api/v1/sessions/users

Retrieve sessions users.

Access: Bearer token

Query: search
Observed status codes: 403
Source: sessionRoute.js:56

### GET /api/v1/sessions/users/:email

Retrieve sessions users selected item.

Access: Bearer token

Path: email
Observed status codes: 403, 404
Source: sessionRoute.js:71

### DELETE /api/v1/sessions/users/:email/:id

Delete sessions users selected item selected item.

Access: Bearer token

Path: email, id
Observed status codes: 400, 403, 404
Source: sessionRoute.js:89

### POST /api/v1/sessions/users/:email/logout-all

Create or execute sessions users selected item logout-all.

Access: Bearer token

Path: email
Observed status codes: 403, 404
Source: sessionRoute.js:103

### POST /api/v1/sessions/logout

Create or execute sessions logout.

Access: Bearer token

No named request fields identified in the traced handler.
Status / payload follows handler and shared error handling.
Source: sessionRoute.js:115

### POST /api/v1/send

Create an in-app notification.

Access: No shared bearer middleware

Body: link, message, receiverId, senderId
Observed status codes: 200, 400, 500
Source: notificationRoutes.js:4

### POST /api/v1/tokenn

Create a headset publisher session and IVS participant token.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200
Source: tokenIvsRoute.js:15

### POST /api/v1/streaming/publisher-session/:sessionId/activate

Activate a published headset session and its replication.

Access: Bearer token

Path: sessionId
Observed status codes: 204
Source: streamingSessionRoute.js:15

### DELETE /api/v1/streaming/publisher-session/:sessionId

Stop the headset publisher session.

Access: Bearer token

Path: sessionId
Observed status codes: 204
Source: streamingSessionRoute.js:16

### POST /api/v1/streaming/self-viewer-session

Create a trainee self-preview viewer session.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 201
Source: streamingSessionRoute.js:17

### POST /api/v1/streaming/viewer-session

Create an institution viewer session.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 201
Source: streamingSessionRoute.js:18

### POST /api/v1/user-completion

Progress Update.

Access: Bearer token

Body: course_id, isCompleted, module_id, user_id
Observed status codes: 200, 500
Source: progressRoute.js:4

### GET /api/v1/get-vr-data/:data_check

Return authenticated user context and the supplied data_check value.

Access: Bearer token

Path: data_check
Observed status codes: 200, 500
Source: getVrDataRoute.js:4

### DELETE /api/v1/delete-batch/:batch_id

Delete Batchc.

Access: Bearer token

Path: batch_id
Observed status codes: 200, 500
Source: deleteBatchRoute.js:4

### GET /api/v1/profile

Profile.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 500
Source: profileRoute.js:5

### GET /api/v1/get-trainees

Trainee.

Access: Bearer token

Query: limit, page
Observed status codes: 200, 500
Source: getTraineesRoute.js:5

### PATCH /api/v1/disable-trainee/:user_mail/:status

Disable Trainee.

Access: Bearer token

Path: user_mail, status
Observed status codes: 200, 400, 500
Source: disableTraineeRoute.js:5

### POST /api/v1/create-batch

Batch Creation.

Access: Bearer token

Body: batch_end_date, batch_name, batch_start_date, certification_data, curiculum_name
Observed status codes: 200, 500
Source: createBatchRoute.js:5

### GET /api/v1/get-batches

Get Batch Data.

Access: Bearer token

Query: limit, page
Observed status codes: 200, 500
Source: getBatchesRoute.js:4

### POST /api/v1/associate-batch

Associate Batchc.

Access: Bearer token

Body: batch_id, user_id
Observed status codes: 200, 500
Source: associateBatchRoute.js:4

### GET /api/v1/batch-filter

Filter Batch.

Access: Bearer token

Query: batch_name, instructor_name
Observed status codes: 200, 500
Source: filterBatchRoute.js:4

### GET /api/v1/get-instructors

Get Instructor Data.

Access: Bearer token

Query: limit, page
Observed status codes: 200, 500
Source: getInstructorRoute.js:4

### GET /api/v1/get-dashboard-data

Get Dashboard.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: dashboardRoute.js:4

### DELETE /api/v1/delete-cur/:curiculum_id

Delete Cur.

Access: Bearer token

Path: curiculum_id
Observed status codes: 200, 500
Source: deleteCuriculumRoute.js:4

### POST /api/v1/create-trainee

Create Trainee.

Access: Bearer token

Body: description, institution_name, status, user_batch, user_batch[], user_contact_num, user_dob, user_email, user_gender, user_name, user_password, user_role
Files: file
Send multipart/form-data.
Observed status codes: 200, 404, 422, 500, 501
Source: createtraineeRoute.js:6

### DELETE /api/v1/delete-trainee/:user_mail

Delete Traineec.

Access: Bearer token

Path: user_mail
Observed status codes: 200, 500
Source: deleteTraineeRoute.js:4

### DELETE /api/v1/delete-ins/:user_mail

Instructor.

Access: Bearer token

Path: user_mail
Observed status codes: 200, 500
Source: deleteInstructorRoute.js:4

### POST /api/v1/create-curiculum

Create Cur.

Access: Bearer token

Body: curiculum_name
Observed status codes: 200, 500
Source: curiculamRoute.js:4

### GET /api/v1/get-curiculum

Get Cur.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: getCuriculumRoute.js:4

### POST /api/v1/create-course

Course.

Access: Bearer token

Body: certificate_name, curiculum_id
Observed status codes: 200, 500
Source: createCourseRoute.js:4

### GET /api/v1/get-courses

Get Courses.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: GetCourseRoute.js:4

### GET /api/v1/get-cours-cur/:curiculum_id

Get Courses By Cur.

Access: Bearer token

Path: curiculum_id
Observed status codes: 200, 500
Source: getCoursesByCurRoute.js:4

### DELETE /api/v1/delete-course/:course_id

Course Deletion.

Access: Bearer token

Path: course_id
Observed status codes: 200, 500
Source: deleteCourseRoute.js:4

### GET /api/v1/get-admins

Get Admin.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: getAdminsRoute.js:4

### POST /api/v1/tag-course

Tag Course.

Access: Bearer token

Body: certificate_id, user_id
Observed status codes: 200, 403, 500
Source: TagCourseRoute.js:4

### GET /api/v1/get-gender-ratio

Gender Ratio.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: getGendersRoutes.js:5

### POST /api/v1/request-course

Request Course.

Access: Bearer token

Body: course_id
Observed status codes: 200, 403, 500
Source: RequestCourseRoute.js:4

### POST /api/v1/create-module

Create a chapter using chapter_name and course_id.

Access: Bearer token

Body: chapter_name, course_id
Observed status codes: 200, 400, 500
Source: createModuleRoute.js:4

### GET /api/v1/get-module

Get Module.

Access: Bearer token

Query: chapter_id
Observed status codes: 200, 500
Source: getModuleRoute.js:4

### POST /api/v1/create-new-module

Create a module underneath a chapter.

Access: Bearer token

Body: chapter_id, module_name
Observed status codes: 200, 400, 500
Source: newModuleRoute.js:4

### POST /api/v1/sub-module

Sub Module.

Access: Bearer token

Body: module_id, submod_name
Observed status codes: 200, 400, 500
Source: subModuleRoute.js:4

### GET /api/v1/resource-completion

Mark resource completion through query parameters.

Access: Bearer token

Query: is_completed, r_id
Observed status codes: 200, 500
Source: moduleCompleteUserRoute.js:4

### GET /api/v1/get-chapter

Get Chapters.

Access: Bearer token

Query: course_id
Observed status codes: 200, 500
Source: getChapterRouter.js:4

### POST /api/v1/create-resource

Create Resource.

Access: Bearer token

Body: learning_module_id, resource_name, resource_type, topic
Observed status codes: 200, 400, 500
Source: createResourceRoute.js:4

### GET /api/v1/get-resources

Get Resources.

Access: Bearer token

Query: learning_module_id
Observed status codes: 200
Source: getResourcesRoute.js:4

### POST /api/v1/resources-mId

Get Resources By Module Ids.

Access: Bearer token

Body: module_id
Observed status codes: 200, 500
Source: getResourcesByModuleIdsRoute.js:4

### GET /api/v1/user-stats

User Stats.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: UserStatusRoute.js:4

### POST /api/v1/create-targeted-learning

Create Targeted Learning.

Access: Bearer token

Body: certificate_id, curiculum_id, end_date, learning_module_id, resource_type, resources_id, start_date, tar_name, trainee_id
Observed status codes: 200, 400, 500
Source: CreateTargetedLearningRoute.js:4

### GET /api/v1/tllist

Get Targeted Learning.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: getTargetedLearningRoute.js:4

### DELETE /api/v1/tl-delete/:targeted_learning_id

Delete Targeted Learning.

Access: Bearer token

Path: targeted_learning_id
Observed status codes: 200, 500
Source: deleteTargetedLearningRoute.js:4

### GET /api/v1/tllist-ind

In TLList.

Access: Bearer token

Query: email, user_mail
Observed status codes: 200, 500
Source: getIndividualTLRoute.js:4

### GET /api/v1/trainee/:people_id

Induuid.

Access: Bearer token

Path: people_id
Query: isVr
Observed status codes: 200, 500
Source: induuidRoute.js:4

### PUT /api/v1/trainee/update

Update trainee batch association using query parameters.

Access: Bearer token

Query: batch_id, user_id
Observed status codes: 200, 500
Source: updateTraineeRoute.js:4

### GET /api/v1/batch-individual/:batch_id

Individual Batch.

Access: Bearer token

Path: batch_id
Observed status codes: 200, 500
Source: IndBatchProfileRoute.js:4

### PUT /api/v1/instructor/update

Update Instructor.

Access: Bearer token

Body: batch_id, user_id
Observed status codes: 200, 500
Source: updateInstructorRoute.js:4

### POST /api/v1/sv-upload

Volume.

Access: Bearer token

Body: description, trimester, volume_fetal_presentation, volume_ga, volume_name, volume_type
Files: file
Send multipart/form-data.
Observed status codes: 200, 400, 403, 404, 406, 500
Source: svUploadRouter.js:26

### PUT /api/v1/update-volume

Update Volume.

Access: Bearer token

Body: description, trimester, volume_fetal_presentation, volume_ga, volume_id, volume_name, volume_type
Observed status codes: 200, 406, 500
Source: svUploadRouter.js:27

### GET /api/v1/get-volumes

Get Volume Data.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: getVolumeDataRoute.js:4

### PATCH /api/v1/approve-volume/:status_approval/:volume_id

Volume Approval.

Access: Bearer token

Path: status_approval, volume_id
Observed status codes: 200, 404
Source: VolumeApprovalRoute.js:4

### GET /api/v1/get-cert/:curiculum_id

Get Certification By Cur.

Access: Bearer token

Path: curiculum_id
Observed status codes: 200
Source: getCertByCurRoute.js:4

### GET /api/v1/get-certdetails/:certification_id

Get Certification Details By Ids.

Access: Bearer token

Path: certification_id
Observed status codes: 200
Source: GetCertificationDetailsByIdRoute.js:4

### POST /api/v1/create-learning-module

Create Learning.

Access: Bearer token

Body: certificate_id, course_name, module_name, unit_name
Observed status codes: 200, 400
Source: CreateLearningModuleRoute.js:4

### GET /api/v1/get-lmid/:certificate_id

Get Learning By Id.

Access: Bearer token

Path: certificate_id
Observed status codes: 200
Source: GetLearningModuleByIdRoute.js:4

### PUT /api/v1/update-batch-data

Update Batch.

Access: Bearer token

Body: batch_id, new_batch_name, new_end_date, new_start_date
Observed status codes: 200, 500
Source: updateBatchRouter.js:4

### POST /api/v1/mark-testscores

Calc Test Score.

Access: Bearer token

Body: diagnostic_interpretation, image_optimization, measurement, plane_identification, r_id
Observed status codes: 200, 400, 500
Source: calTestScoreRoute.js:4

### GET /api/v1/get-resource-lmandrt

Get Resource Bylmandrt.

Access: Bearer token

Query: learning_module_id, r_type
Observed status codes: 200
Source: getResourceBylmandrtRoute.js:4

### GET /api/v1/instructor-ind

Ins Data Analysis.

Access: Bearer token

Query: people_id
Observed status codes: 200, 500
Source: getInstructorDataAnalysisRoute.js:4

### PUT /api/v1/mark-testscores-re

Update reattempt scores using query parameters.

Access: Bearer token

Query: diagnostic_interpretation, image_optimization, measurement, plane_identification, r_id
Observed status codes: 200, 500
Source: attemptTestRouter.js:4

### GET /api/v1/get-volumes-by-instructor

Get Volume Instructor View.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: getVolumeByInstructorRoute.js:4

### GET /api/v1/volumes/:volume_id/download

Get Volume Download.

Access: Bearer token

Path: volume_id
Query: file
Observed status codes: 200, 400, 404, 502
Source: getVolumeByInstructorRoute.js:5

### GET /api/v1/volumes/:volume_id/recordings

Get Volume Recording Download List.

Access: Bearer token

Path: volume_id
Observed status codes: 200, 400, 403, 404, 500
Source: getVolumeByInstructorRoute.js:6

### GET /api/v1/volumes/:volume_id/recordings/:recording_id/download

Get Volume Recording Download.

Access: Bearer token

Path: volume_id, recording_id
Query: file, index
Observed status codes: 200, 400, 404, 502
Source: getVolumeByInstructorRoute.js:7

### PUT /api/v1/convert-vol/:volume_id

Update Volume Con.

Access: Bearer token

Path: volume_id
Observed status codes: 200, 400, 404, 409, 429, 500
Source: UpdateVolumeConRouter.js:5

### GET /api/v1/converted-volumes

Get Conv Volume List.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: getConvVolumeListRoute.js:4

### GET /api/v1/volume-placements/:volume_id

Get Volume Placements By Volume Id.

Access: Bearer token

Path: volume_id
Query: volume_id
Observed status codes: 200, 400, 500
Source: volumePlacementRoute.js:6

### GET /api/v1/volume-placements

Get Volume Placements.

Access: Bearer token

Query: volume_id
Observed status codes: 200, 500
Source: volumePlacementRoute.js:7

### POST /api/v1/volume-placement

Volume Placement.

Access: Bearer token

Body: volume_id
Files: placed_file
Send multipart/form-data.
Observed status codes: 200, 400, 404, 500
Source: volumePlacementRoute.js:8

### GET /api/v1/recordings

Get Recordings.

Access: Bearer token

Query: volume_id
Observed status codes: 200, 400, 500
Source: volumeRecordingRoute.js:15

### POST /api/v1/uploadvolumerecording

Vol Recording.

Access: Bearer token

Body: recording_name, recording_type, volume_id
Files: audio_file, images, manifest_file, recording_file
Send multipart/form-data.
Observed status codes: 200, 400, 404, 500
Source: volumeRecordingRoute.js:19

### POST /api/v1/associateVolume

Assoc Volume.

Access: Bearer token

Body: r_id, shadowrec_id, steprec_id, volume_id
Observed status codes: 200, 404, 500
Source: associateVolumeRouter.js:4

### POST /api/v1/course-mappings

Create Course Mapping.

Access: Bearer token

Body: anatomy_type, course_name, course_type, description, doctor_name, module_name, shadow_recording_id, step_recording_id, trimester, volume_name
Observed status codes: 201, 400, 500
Source: courseMappingRoute.js:10

### GET /api/v1/course-mappings

Get Course Mappings.

Access: Bearer token

Query: anatomy_type, course_type, module_name, trimester, volume_name
Observed status codes: 200, 500
Source: courseMappingRoute.js:11

### GET /api/v1/course-mappings/with-recordings

Get Course Mappings With Recordings.

Access: Bearer token

Query: anatomy_type, course_type, module_name, trimester, volume_name
Observed status codes: 200, 500
Source: courseMappingRoute.js:12

### GET /api/v1/clusters

Get Clusters.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: clusterRoute.js:27

### GET /api/v1/get-clusters

Get Clusters.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: clusterRoute.js:28

### GET /api/v1/cluster

Get Clusters.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: clusterRoute.js:29

### GET /api/v1/clusters/recording-counts

Get Cluster Recording Counts.

Access: Bearer token

Query: cluster_id
Observed status codes: 200, 500
Source: clusterRoute.js:32

### GET /api/v1/cluster-recording-counts

Get Cluster Recording Counts.

Access: Bearer token

Query: cluster_id
Observed status codes: 200, 500
Source: clusterRoute.js:33

### GET /api/v1/clusters/recordings

Get Cluster Recordings.

Access: Bearer token

Query: cluster_id, recording_type
Observed status codes: 200, 400, 500
Source: clusterRoute.js:34

### GET /api/v1/cluster-recordings

Get Cluster Recordings.

Access: Bearer token

Query: cluster_id, recording_type
Observed status codes: 200, 400, 500
Source: clusterRoute.js:35

### GET /api/v1/clusters/:cluster_id/recordings

Get Cluster Recordings.

Access: Bearer token

Path: cluster_id
Query: cluster_id, recording_type
Observed status codes: 200, 400, 500
Source: clusterRoute.js:36

### GET /api/v1/clusters/:cluster_id/shadow-recordings

Retrieve clusters selected item shadow-recordings.

Access: Bearer token

Path: cluster_id
Query: cluster_id
Observed status codes: 200, 400, 500
Source: clusterRoute.js:37

### GET /api/v1/clusters/:cluster_id/step-recordings

Retrieve clusters selected item step-recordings.

Access: Bearer token

Path: cluster_id
Query: cluster_id
Observed status codes: 200, 400, 500
Source: clusterRoute.js:41

### GET /api/v1/clusters/:cluster_id/recording-counts

Get Cluster Recording Counts.

Access: Bearer token

Path: cluster_id
Query: cluster_id
Observed status codes: 200, 500
Source: clusterRoute.js:45

### GET /api/v1/clusters/:cluster_id/recordings/:recording_id/download

Get Cluster Recording Download.

Access: Bearer token

Path: cluster_id, recording_id
Query: file, index
Observed status codes: 200, 400, 404, 500
Source: clusterRoute.js:46

### POST /api/v1/clusters/:cluster_id/recordings

Upload Cluster Recording.

Access: Bearer token

Path: cluster_id
Body: cluster_id, recording_name, recording_type, volume_id
Files: audio_file, audio_files, image_files, images, manifest, manifest_file, rec_files, recording_file, recording_files
Send multipart/form-data.
Observed status codes: 200, 400, 404, 500
Source: clusterRoute.js:61

### PUT /api/v1/clusters/:cluster_id/recordings/:recording_id

Replace Cluster Recording.

Access: Bearer token

Path: cluster_id, recording_id
Body: cluster_id, recording_id, recording_name, recording_type
Files: audio_file, audio_files, image_files, images, manifest, manifest_file, rec_files, recording_file, recording_files
Send multipart/form-data.
Observed status codes: 200, 400, 403, 404, 500
Source: clusterRoute.js:67

### POST /api/v1/clusters/:cluster_id/recordings/replace

Replace Cluster Recording.

Access: Bearer token

Path: cluster_id
Body: cluster_id, recording_id, recording_name, recording_type
Files: audio_file, audio_files, image_files, images, manifest, manifest_file, rec_files, recording_file, recording_files
Send multipart/form-data.
Observed status codes: 200, 400, 403, 404, 500
Source: clusterRoute.js:72

### PUT /api/v1/clusters/:cluster_id/recordings/replace

Replace Cluster Recording.

Access: Bearer token

Path: cluster_id
Body: cluster_id, recording_id, recording_name, recording_type
Files: audio_file, audio_files, image_files, images, manifest, manifest_file, rec_files, recording_file, recording_files
Send multipart/form-data.
Observed status codes: 200, 400, 403, 404, 500
Source: clusterRoute.js:77

### POST /api/v1/clusters/recordings/replace

Replace Cluster Recording.

Access: Bearer token

Body: cluster_id, recording_id, recording_name, recording_type
Files: audio_file, audio_files, image_files, images, manifest, manifest_file, rec_files, recording_file, recording_files
Send multipart/form-data.
Observed status codes: 200, 400, 403, 404, 500
Source: clusterRoute.js:82

### PUT /api/v1/clusters/recordings/replace

Replace Cluster Recording.

Access: Bearer token

Body: cluster_id, recording_id, recording_name, recording_type
Files: audio_file, audio_files, image_files, images, manifest, manifest_file, rec_files, recording_file, recording_files
Send multipart/form-data.
Observed status codes: 200, 400, 403, 404, 500
Source: clusterRoute.js:87

### GET /api/v1/clusters/:cluster_id

Get Cluster By Id.

Access: Bearer token

Path: cluster_id
Observed status codes: 200, 500
Source: clusterRoute.js:93

### GET /api/v1/cluster/:cluster_id

Get Cluster By Id.

Access: Bearer token

Path: cluster_id
Observed status codes: 200, 500
Source: clusterRoute.js:94

### POST /api/v1/clusters

Create Cluster.

Access: Bearer token

Body: cluster_id, cluster_name, fetal_presentation, selected_volume_ids, volume_id, volume_ids
Observed status codes: 500
Source: clusterRoute.js:95

### POST /api/v1/cluster

Create Cluster.

Access: Bearer token

Body: cluster_id, cluster_name, fetal_presentation, selected_volume_ids, volume_id, volume_ids
Observed status codes: 500
Source: clusterRoute.js:96

### POST /api/v1/create-cluster

Create Cluster.

Access: Bearer token

Body: cluster_id, cluster_name, fetal_presentation, selected_volume_ids, volume_id, volume_ids
Observed status codes: 500
Source: clusterRoute.js:97

### POST /api/v1/add-cluster

Create Cluster.

Access: Bearer token

Body: cluster_id, cluster_name, fetal_presentation, selected_volume_ids, volume_id, volume_ids
Observed status codes: 500
Source: clusterRoute.js:98

### PUT /api/v1/clusters/:cluster_id

Update Cluster.

Access: Bearer token

Path: cluster_id
Body: cluster_name, fetal_presentation, selected_volume_ids, volume_id, volume_ids
Observed status codes: 500
Source: clusterRoute.js:99

### PUT /api/v1/cluster/:cluster_id

Update Cluster.

Access: Bearer token

Path: cluster_id
Body: cluster_name, fetal_presentation, selected_volume_ids, volume_id, volume_ids
Observed status codes: 500
Source: clusterRoute.js:100

### DELETE /api/v1/clusters/:cluster_id

Delete Cluster.

Access: Bearer token

Path: cluster_id
Observed status codes: 500
Source: clusterRoute.js:101

### DELETE /api/v1/cluster/:cluster_id

Delete Cluster.

Access: Bearer token

Path: cluster_id
Observed status codes: 500
Source: clusterRoute.js:102

### GET /api/v1/courses

List Courses.

Access: Bearer token

Query: view
Status / payload follows handler and shared error handling.
Source: contentAccessRoute.js:6

### POST /api/v1/courses

Create Course.

Access: Bearer token

Body: courseKind, curriculumId, name
Status / payload follows handler and shared error handling.
Source: contentAccessRoute.js:7

### PATCH /api/v1/courses/:courseId

Update Course.

Access: Bearer token

Path: courseId
Body: curriculumId, name
Status / payload follows handler and shared error handling.
Source: contentAccessRoute.js:8

### POST /api/v1/courses/:courseId/publish

Publish Course.

Access: Bearer token

Path: courseId
Status / payload follows handler and shared error handling.
Source: contentAccessRoute.js:9

### POST /api/v1/courses/:courseId/archive

Archive Course.

Access: Bearer token

Path: courseId
Status / payload follows handler and shared error handling.
Source: contentAccessRoute.js:10

### POST /api/v1/courses/:courseId/draft

Draft Course.

Access: Bearer token

Path: courseId
Status / payload follows handler and shared error handling.
Source: contentAccessRoute.js:11

### PUT /api/v1/courses/:courseId/institution-access

Set Institution Access.

Access: Bearer token

Path: courseId
Body: institutionIds, mode
Status / payload follows handler and shared error handling.
Source: contentAccessRoute.js:12

### PUT /api/v1/courses/:courseId/assignments

Replace Assignments.

Access: Bearer token

Path: courseId
Body: assignedTraineeIds, batchIds, excludedTraineeIds
Status / payload follows handler and shared error handling.
Source: contentAccessRoute.js:13

### GET /api/v1/courses/:courseId/assignments

Get Assignments.

Access: Bearer token

Path: courseId
Status / payload follows handler and shared error handling.
Source: contentAccessRoute.js:14

### GET /api/v1/courses/:courseId/effective-access

Get Effective Access.

Access: Bearer token

Path: courseId
Query: institutionId
Status / payload follows handler and shared error handling.
Source: contentAccessRoute.js:15

### GET /api/v1/me/courses

List My Courses.

Access: Bearer token

No named request fields identified in the traced handler.
Status / payload follows handler and shared error handling.
Source: contentAccessRoute.js:16

### GET /api/v1/migration-review

List Migration Review.

Access: Bearer token

No named request fields identified in the traced handler.
Status / payload follows handler and shared error handling.
Source: contentAccessRoute.js:17

### PUT /api/v1/migration-review/courses/:courseId

Resolve Course Ownership.

Access: Bearer token

Path: courseId
Body: courseKind, institutionId
Status / payload follows handler and shared error handling.
Source: contentAccessRoute.js:18

### PUT /api/v1/migration-review/volumes/:volumeId

Resolve Volume Ownership.

Access: Bearer token

Path: volumeId
Body: institutionId, ownerScope
Status / payload follows handler and shared error handling.
Source: contentAccessRoute.js:19

### POST /api/v1/migration-review/course-mappings/:mappingId

Migrate Course Mapping.

Access: Bearer token

Path: mappingId
Body: courseKind
Status / payload follows handler and shared error handling.
Source: contentAccessRoute.js:20

### GET /api/v1/mr/workspace

Retrieve the requester’s permitted headset content workspace.

Access: Bearer token

No named request fields identified in the traced handler.
Status / payload follows handler and shared error handling.
Source: mrContentRoute.js:6

### GET /api/v1/mr/courses

Retrieve courses available to the headset content workspace.

Access: Bearer token

No named request fields identified in the traced handler.
Status / payload follows handler and shared error handling.
Source: mrContentRoute.js:7

### GET /api/v1/mr/courses/:courseId/package

Retrieve the authorized course content package.

Access: Bearer token

Path: courseId
Status / payload follows handler and shared error handling.
Source: mrContentRoute.js:8

### PUT /api/v1/recordings/:recordingId/validation

Validate Recording.

Access: Bearer token

Path: recordingId
Body: state
Status / payload follows handler and shared error handling.
Source: mrContentRoute.js:9

### POST /api/v1/courses/:courseId/content

Attach Content.

Access: Bearer token

Path: courseId
Body: resourceId, shadowRecordingId, stepRecordingId, volumeId
Status / payload follows handler and shared error handling.
Source: mrContentRoute.js:10

### GET /api/v1/institutions

Get Scan Centers.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 401, 500
Source: institutionRoute.js:6

### POST /api/v1/institutions

Create Scan Center.

Access: Bearer token

Body: center_address, center_email, center_name, center_phone, status
Observed status codes: 201, 400, 401, 500
Source: institutionRoute.js:7

### POST /api/v1/institutions/:institutionId/admins

Add Institution Admin.

Access: Bearer token

Path: institutionId
Body: user_contact_num, user_email, user_name
Observed status codes: 500
Source: institutionRoute.js:8

### GET /api/v1/super-admins

Retrieve super-admins.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200
Source: superAdminRoute.js:5

### POST /api/v1/super-admins

Create or execute super-admins.

Access: Bearer token

Body: user_contact_num, user_email, user_name
Observed status codes: 201
Source: superAdminRoute.js:6

### GET /api/v1/superadmin/stats

Retrieve superadmin stats.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200
Source: superAdminRoute.js:7

### GET /api/v1/superadmin-stats

Retrieve superadmin-stats.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200
Source: superAdminRoute.js:8

### GET /api/v1/super-admin/statistics

Retrieve super-admin statistics.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200
Source: superAdminRoute.js:11

### GET /api/v1/superadmin/statistics

Retrieve superadmin statistics.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200
Source: superAdminRoute.js:12

### GET /api/v1/super-admin/activity-summary

Retrieve super-admin activity-summary.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200
Source: superAdminRoute.js:14

### GET /api/v1/superadmin/activity-summary

Retrieve superadmin activity-summary.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200
Source: superAdminRoute.js:15

### GET /api/v1/super-admin/recent-activities

Retrieve super-admin recent-activities.

Access: Bearer token

Query: limit, module, page, role, status
Observed status codes: 200
Source: superAdminRoute.js:17

### GET /api/v1/superadmin/recent-activities

Retrieve superadmin recent-activities.

Access: Bearer token

Query: limit, module, page, role, status
Observed status codes: 200
Source: superAdminRoute.js:18

### POST /api/v1/activity-logs/track

Track Client Activity.

Access: Optional decoded token

Query: isVR, isVr, isvr
Body: action, isVR, isVr, isvr, metadata, module, role, status, targetId, targetType, userId
Observed status codes: 201, 400, 500
Source: activityTrackerRoute.js:38

### GET /api/v1/activity-logs/statistics

Get Statistics.

Access: No shared bearer middleware

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: activityTrackerRoute.js:39

### GET /api/v1/activity-logs/recent

Get Recent.

Access: No shared bearer middleware

Query: limit, module, page, role, status
Observed status codes: 200, 500
Source: activityTrackerRoute.js:40

### GET /api/v1/activity-logs/summary

Get Summary.

Access: No shared bearer middleware

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: activityTrackerRoute.js:41

### GET /api/v1/shadow-recordings

Shadow Recording Data.

Access: Bearer token

Query: volume_id
Observed status codes: 200, 500
Source: GetShadowRecordingRoute.js:4

### GET /api/v1/shadow-recording-counts

Volume Recording Counts.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: GetShadowRecordingRoute.js:5

### GET /api/v1/volume-recording-counts

Volume Recording Counts.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: GetShadowRecordingRoute.js:6

### GET /api/v1/get-assovol

Get Associated Volume.

Access: Bearer token

Query: r_id
Observed status codes: 200, 500
Source: getAssoVolumeRoute.js:4

### POST /api/v1/create-scan-center

Create Scan Center.

Access: Bearer token

Body: center_address, center_email, center_name, center_phone, status
Observed status codes: 201, 400, 401, 500
Source: createScanCentersRoute.js:5

### GET /api/v1/get-scan-centers

Get Scan Centers.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 401, 500
Source: getScanCenterRoute.js:4

### POST /api/v1/mind-spark-options

Save a legacy MindSpark option response.

Access: Bearer token

Body: correct_opt, r_id, status, user_opt
Observed status codes: 200, 500
Source: mindSparkRoute.js:4

### POST /api/v1/mind-spark-questions

Create Questions.

Access: Bearer token

Body: mindsparkNo, mindspark_no, questions, resource_id
Observed status codes: 200, 400, 401, 500
Source: questionsRoute.js:18

### POST /api/v1/mind-spark-question-assets

Upload Asset.

Access: Bearer token

Files: image
Send multipart/form-data.
Observed status codes: 200, 400, 401, 500
Source: questionsRoute.js:19

### GET /api/v1/mind-spark-questions

Get Questions.

Access: Bearer token

Query: include_inactive, mindspark_no, resource_id
Observed status codes: 200, 400, 401, 500
Source: questionsRoute.js:20

### GET /api/v1/mind-spark-attempt-details

Get Attempt Details.

Access: Bearer token

Query: resource_id, session_id
Observed status codes: 200, 400, 401, 500
Source: questionsRoute.js:21

### PUT /api/v1/mind-spark-questions/:question_id

Update Question.

Access: Bearer token

Path: question_id
Body: answer, assets, correctAnswer, correct_answer, feedbackCorrect, feedbackWrong, feedback_correct, feedback_wrong, isActive, is_active, metadata, mindsparkNo, mindspark_no, options, options_available, prompt, question, questionNo, questionType, question_no, question_query, question_type
Observed status codes: 200, 400, 401, 404, 500
Source: questionsRoute.js:22

### DELETE /api/v1/mind-spark-questions/:question_id

Delete Question.

Access: Bearer token

Path: question_id
Observed status codes: 200, 400, 401, 404, 500
Source: questionsRoute.js:23

### POST /api/v1/create-question

Create Questions.

Access: Bearer token

Body: mindsparkNo, mindspark_no, questions, resource_id
Observed status codes: 200, 400, 401, 500
Source: questionsRoute.js:25

### POST /api/v1/submit-ii

Submit an image-interpretation, annotation or measurement result.

Access: Bearer token

Body: caliperPlacementInterpretation, correctLabelCount, interpretation, isCorrect, optionChosen, partial, questionNo, questionType, resource_id, session_id, unusedLabelCount, value, wrongLabelCount
Files: userImage
Send multipart/form-data.
Observed status codes: 400
Source: iivrRoutes.js:6

### POST /api/v1/start-ii-prac

Start an image-interpretation practice or test session.

Access: Bearer token

Body: resource_id
Observed status codes: 200, 500
Source: iivrStartTestRoute.js:4

### PUT /api/v1/end-ii-prac

End an image-interpretation session using test_id.

Access: Bearer token

Body: test_id
Observed status codes: 200, 500
Source: iivrEndTestRoute.js:4

### GET /api/v1/practice-i-ii

Get Practices By User.

Access: Bearer token

Query: resource_id
Observed status codes: 200, 400, 401, 500
Source: practiceRoute.js:4

### POST /api/v1/practice-i-ii

Bulk Create Practice Results.

Access: Bearer token

Body: practice_id, practice_number, practiceresults, resource_id
Observed status codes: 201, 400, 401, 500
Source: practiceRoute.js:5

### POST /api/v1/submit-prac-test

Prac Test.

Access: Bearer token

Body: payload, resource_id, sessionNumber, sessionType, session_id
Files: expertImage_1, expertImage_2, expertImages_1, expertImages_2, userImage_1, userImage_2, userImages_1, userImages_2
Send multipart/form-data.
Observed status codes: 400, 500
Source: pracTestRoute.js:23

### GET /api/v1/prac-test-attempt-details/:resource_id

Get Prac Test Attempt Details.

Access: Bearer token

Path: resource_id
Observed status codes: 500
Source: pracTestRoute.js:38

### POST /api/v1/submit-msob

Submit a MindSpark or OB Booster activity result.

Access: Bearer token

Body: hasTakenClue, isCorrect, optionChosen, payload, questionNo, resourceId, resourceType, sessionId, timeTaken, totalTimeTaken
Observed status codes: 200, 400, 500
Source: lrobRoute.js:14

### GET /api/v1/instructor-as-per-batch

Instructor Batch.

Access: Bearer token

Query: people_id
Observed status codes: 200, 400, 500
Source: getInstructorAsPerBatch.js:4

### GET /api/v1/get-submissions

Get Submissions.

Access: Bearer token

Query: resource_id
Observed status codes: 500
Source: getSubmissionsRoute.js:5

### POST /api/v1/queries

Create Query.

Access: Bearer token

Body: instructor_id, message, subject
Observed status codes: 200, 400, 500
Source: queriesRoute.js:5

### GET /api/v1/queries

Get Queries.

Access: Bearer token

Query: limit, page
Observed status codes: 200, 500
Source: queriesRoute.js:6

### PUT /api/v1/queries/:query_id/status

Update Query Status.

Access: Bearer token

Path: query_id
Body: status
Observed status codes: 200, 400, 500
Source: queriesRoute.js:7

### DELETE /api/v1/queries/:query_id

Delete Query.

Access: Bearer token

Path: query_id
Observed status codes: 200, 500
Source: queriesRoute.js:8

### GET /api/v1/interactions-attempt-stats

Interactions Attempt Stats.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: InteractionsAttemptStats.js:5

### GET /api/v1/activity-last-scores

Activity Last Scores.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: activityLastScoresRoute.js:5

### GET /api/v1/skill-competency

Skill Competency.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: skillCompetencyRoute.js:6

### GET /api/v1/performance-metrics

Performance Metrics.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: performanceMetricsRoute.js:6

### POST /api/v1/reatt-data

Create Reatt Data.

Access: Bearer token

Body: certificate_id, course_id, max_reattempt_count, resource_id, resource_type, unit_name, uploaded_by
Observed status codes: 400, 500
Source: reattRoute.js:9

### GET /api/v1/reatt-data

Get Reatt Data.

Access: Bearer token

Query: uploaded_by, certificate_id, course_id, unit_name, resource_type, resource_id, max_reattempt_count
Observed status codes: 500
Source: reattRoute.js:10

### GET /api/v1/challenges/questions

Get Challenge Questions.

Access: Bearer token

Query: all, challenge_name, challenge_number, module_name, resource_id
Observed status codes: 500
Source: challengeRoute.js:10

### POST /api/v1/challenges/submit

Submit Challenge.

Access: Bearer token

Body: choose_option, isCorrect, question_number, resource_id, session_id
Observed status codes: 400, 500
Source: challengeRoute.js:11

### GET /api/v1/challenges/attempt-details

Get Challenge Attempt Details.

Access: Bearer token

Query: resource_id, session_id
Observed status codes: 400, 500
Source: challengeRoute.js:12

## Medica companion

### GET /test

Return authenticated test-route and user information.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 401, 403
Source: Medica/v1/app.js:100

### POST /api/v1/login

Sign in and receive tokens plus account and device context.

Access: No shared bearer middleware

Body: user_mail, user_password
Observed status codes: 200, 400, 401, 404, 500
Source: Auth.js:5

### POST /api/v1/forgot-password

Record a password-recovery request and attempt an email.

Access: No shared bearer middleware

Body: reset_password_mail
Observed status codes: 200, 400, 404, 500
Source: forgotpRoute.js:5

### POST /api/v1/token

Refresh Token.

Access: No shared bearer middleware

Body: token
Observed status codes: 401, 403
Source: refreshTokenRouter.js:5

### GET /api/v1/ivs-ind

Get Individual Streaming Data.

Access: No shared bearer middleware

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: individualIvsRoute.js:6

### POST /api/v1/send

Create an in-app notification.

Access: No shared bearer middleware

Body: link, message, receiverId, senderId
Observed status codes: 200, 400, 500
Source: notificationRoutes.js:4

### POST /api/v1/tokenn

Create a headset publisher session and IVS participant token.

Access: No shared bearer middleware

Body: attributes, capabilities, duration, stageArn, userId
Observed status codes: 200, 500
Source: tokenIvsRoute.js:4

### POST /api/v1/get-active-people-room

Get Active People.

Access: No shared bearer middleware

Body: roomId
Observed status codes: 200, 500
Source: activePeopleRoomRoute.js:4

### POST /api/v1/user-completion

Progress Update.

Access: Bearer token

Body: course_id, isCompleted, module_id, user_id
Observed status codes: 200, 500
Source: progressRoute.js:4

### GET /api/v1/get-vr-data/:data_check

Return authenticated user context and the supplied data_check value.

Access: Bearer token

Path: data_check
Observed status codes: 200, 500
Source: getVrDataRoute.js:4

### DELETE /api/v1/delete-batch/:batch_id

Delete Batchc.

Access: Bearer token

Path: batch_id
Observed status codes: 200, 500
Source: deleteBatchRoute.js:4

### GET /api/v1/profile

Profile.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 500
Source: profileRoute.js:5

### GET /api/v1/get-trainees

Trainee.

Access: Bearer token

Query: limit, page
Observed status codes: 200, 500
Source: getTraineesRoute.js:5

### PATCH /api/v1/disable-trainee/:user_mail/:status

Disable Trainee.

Access: Bearer token

Path: user_mail, status
Observed status codes: 200, 400, 500
Source: disableTraineeRoute.js:5

### POST /api/v1/create-batch

Batch Creation.

Access: Bearer token

Body: batch_end_date, batch_name, batch_start_date, course_data, curiculum_name
Observed status codes: 200, 500
Source: createBatchRoute.js:5

### GET /api/v1/get-batches

Get Batch Data.

Access: Bearer token

Query: limit, page
Observed status codes: 200, 500
Source: getBatchesRoute.js:4

### POST /api/v1/associate-batch

Associate Batchc.

Access: Bearer token

Body: batch_id, user_id
Observed status codes: 200, 500
Source: associateBatchRoute.js:4

### GET /api/v1/batch-filter

Filter Batch.

Access: Bearer token

Query: batch_name, instructor_name
Observed status codes: 200, 500
Source: filterBatchRoute.js:4

### GET /api/v1/get-instructors

Get Instructor Data.

Access: Bearer token

Query: limit, page
Observed status codes: 200, 500
Source: getInstructorRoute.js:4

### GET /api/v1/get-dashboard-data

Get Dashboard.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: dashboardRoute.js:4

### DELETE /api/v1/delete-cur/:curiculum_id

Delete Cur.

Access: Bearer token

Path: curiculum_id
Observed status codes: 200, 500
Source: deleteCuriculumRoute.js:4

### POST /api/v1/create-trainee

Create Trainee.

Access: Bearer token

Body: description, status, user_batch, user_contact_num, user_dob, user_email, user_gender, user_name, user_password, user_role
Files: file
Send multipart/form-data.
Observed status codes: 200, 404, 500, 501
Source: createtraineeRoute.js:6

### DELETE /api/v1/delete-trainee/:user_mail

Delete Traineec.

Access: Bearer token

Path: user_mail
Observed status codes: 200, 500
Source: deleteTraineeRoute.js:4

### DELETE /api/v1/delete-ins/:user_mail

Instructor.

Access: Bearer token

Path: user_mail
Observed status codes: 200, 500
Source: deleteInstructorRoute.js:4

### POST /api/v1/create-curiculum

Create Cur.

Access: Bearer token

Body: curiculum_name
Observed status codes: 200, 500
Source: curiculamRoute.js:4

### GET /api/v1/get-curiculum

Get Cur.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: getCuriculumRoute.js:4

### POST /api/v1/create-course

Course.

Access: Bearer token

Body: course_name, curiculum_id
Observed status codes: 200, 500
Source: createCourseRoute.js:4

### GET /api/v1/get-courses

Get Courses.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: GetCourseRoute.js:4

### GET /api/v1/get-cours-cur/:curiculum_id

Get Courses By Cur.

Access: Bearer token

Path: curiculum_id
Observed status codes: 200, 500
Source: getCoursesByCurRoute.js:4

### DELETE /api/v1/delete-course/:course_id

Course Deletion.

Access: Bearer token

Path: course_id
Observed status codes: 200, 500
Source: deleteCourseRoute.js:4

### GET /api/v1/get-admins

Get Admin.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: getAdminsRoute.js:4

### POST /api/v1/tag-course

Tag Course.

Access: Bearer token

Body: course_id, user_id
Observed status codes: 200, 403, 500
Source: TagCourseRoute.js:4

### GET /api/v1/get-gender-ratio

Gender Ratio.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: getGendersRoutes.js:5

### POST /api/v1/request-course

Request Course.

Access: Bearer token

Body: course_id
Observed status codes: 200, 403, 500
Source: RequestCourseRoute.js:4

### POST /api/v1/create-module

Create a chapter using chapter_name and course_id.

Access: Bearer token

Body: chapter_name, course_id
Observed status codes: 200, 400, 500
Source: createModuleRoute.js:4

### GET /api/v1/get-module

Get Module.

Access: Bearer token

Query: chapter_id
Observed status codes: 200, 500
Source: getModuleRoute.js:4

### POST /api/v1/create-new-module

Create a module underneath a chapter.

Access: Bearer token

Body: chapter_id, module_name
Observed status codes: 200, 400, 500
Source: newModuleRoute.js:4

### POST /api/v1/sub-module

Sub Module.

Access: Bearer token

Body: module_id, submod_name
Observed status codes: 200, 400, 500
Source: subModuleRoute.js:4

### GET /api/v1/resource-completion

Mark resource completion through query parameters.

Access: Bearer token

Query: is_completed, r_id
Observed status codes: 200, 500
Source: moduleCompleteUserRoute.js:4

### GET /api/v1/get-chapter

Get Chapters.

Access: Bearer token

Query: course_id
Observed status codes: 200, 500
Source: getChapterRouter.js:4

### POST /api/v1/create-resource

Create Resource.

Access: Bearer token

Body: module_id, resource_name
Observed status codes: 200, 400, 500
Source: createResourceRoute.js:4

### GET /api/v1/get-resources

Get Resources.

Access: Bearer token

Query: module_id
Observed status codes: 200
Source: getResourcesRoute.js:4

### POST /api/v1/resources-mId

Get Resources By Module Ids.

Access: Bearer token

Body: module_id
Observed status codes: 200, 500
Source: getResourcesByModuleIdsRoute.js:4

### GET /api/v1/user-stats

User Stats.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: UserStatusRoute.js:4

### POST /api/v1/create-targeted-learning

Create Targeted Learning.

Access: Bearer token

Body: chapter_id, course_id, curiculum_id, end_date, module_id, resources_id, start_date, tar_name, trainee_id
Observed status codes: 200, 400, 500
Source: CreateTargetedLearningRoute.js:4

### GET /api/v1/tllist

Get Targeted Learning.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: getTargetedLearningRoute.js:4

### DELETE /api/v1/tl-delete/:targeted_learning_id

Delete Targeted Learning.

Access: Bearer token

Path: targeted_learning_id
Observed status codes: 200, 500
Source: deleteTargetedLearningRoute.js:4

### GET /api/v1/tllist-ind

In TLList.

Access: Bearer token

No named request fields identified in the traced handler.
Observed status codes: 200, 500
Source: getIndividualTLRoute.js:4

### GET /api/v1/trainee/:people_id

Induuid.

Access: Bearer token

Path: people_id
Observed status codes: 200, 500
Source: induuidRoute.js:4
