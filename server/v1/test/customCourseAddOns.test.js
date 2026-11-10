const test = require('node:test');
const assert = require('node:assert/strict');
const { appendCustomCourseAddOns } = require('../model/customCourseAddOns');

const mapping = {
  mapping_id: 'mapping-1',
  course_name: 'Scan practice',
  course_type: 'Free Scan',
  cluster_id: 'cluster-1',
  cluster_name: 'Head scans',
  tagged_unit_name: 'BPD & HC',
  shadow_recording: { recording_id: 'shadow-1', rec_files: ['shadow.json'] },
  step_recording: { recording_id: 'step-1', rec_files: ['step.json'] },
};

test('custom course appears beside Practice and Test inside its tagged BTC unit', () => {
  const unit = { unit_name: 'BPD & HC', practices: [{ resource_name: 'Practice 1' }], tests: [{ resource_name: 'Test 1' }] };
  const ac = { unit_name: 'AC', practices: [], tests: [] };
  const certificates = [{ certificate_name: 'BTC', courses: [{
    course_name: 'Second Trimester', modules: [{ module_name: 'Biometry', units: [unit, ac] }],
  }] }];
  appendCustomCourseAddOns(certificates, [mapping, mapping]);

  assert.equal(certificates[0].courses.length, 1);
  assert.deepEqual(unit.practices, [{ resource_name: 'Practice 1' }]);
  assert.deepEqual(unit.tests, [{ resource_name: 'Test 1' }]);
  assert.equal(unit.add_on_courses.length, 1);
  assert.equal(unit.add_on_courses[0].course_name, 'Scan practice');
  assert.equal(unit.add_on_courses[0].is_add_on, true);
  assert.deepEqual(unit.add_on_courses[0].shadow_recording, mapping.shadow_recording);
  assert.deepEqual(unit.add_on_courses[0].step_recording, mapping.step_recording);
  assert.deepEqual(ac.add_on_courses, []);
});

test('custom course is omitted when BTC is not an active certificate', () => {
  const certificates = [{ certificate_name: 'UFC', courses: [{ course_name: 'Knobology', modules: [] }] }];
  appendCustomCourseAddOns(certificates, [mapping]);
  assert.equal(certificates[0].courses.length, 1);
});
