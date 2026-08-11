const express = require('express');
const controller = require('../controller/ContentAccessController');

const router = express.Router();

router.get('/courses', controller.listCourses);
router.post('/courses', controller.createCourse);
router.patch('/courses/:courseId', controller.updateCourse);
router.post('/courses/:courseId/publish', controller.publishCourse);
router.post('/courses/:courseId/archive', controller.archiveCourse);
router.post('/courses/:courseId/draft', controller.draftCourse);
router.put('/courses/:courseId/institution-access', controller.setInstitutionAccess);
router.put('/courses/:courseId/assignments', controller.replaceAssignments);
router.get('/courses/:courseId/assignments', controller.getAssignments);
router.get('/courses/:courseId/effective-access', controller.getEffectiveAccess);
router.get('/me/courses', controller.listMyCourses);
router.get('/migration-review', controller.listMigrationReview);
router.put('/migration-review/courses/:courseId', controller.resolveCourseOwnership);
router.put('/migration-review/volumes/:volumeId', controller.resolveVolumeOwnership);
router.post('/migration-review/course-mappings/:mappingId', controller.migrateCourseMapping);

module.exports = router;
