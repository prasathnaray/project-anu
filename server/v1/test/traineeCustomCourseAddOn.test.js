const test = require('node:test');
const assert = require('node:assert/strict');

const queries = [];
const client = {
  query(sql, params, callback) {
    queries.push({ sql, params });
    if (/FROM public\.user_data ud\s+JOIN public\.course_mapping_placements cmp/.test(sql)) {
      callback(null, { rows: [{
        mapping_id: 'mapping-1', course_name: 'Scan practice', course_type: 'Free Scan',
        cluster_id: 'cluster-1', tagged_unit_name: 'BPD & HC',
        shadow_recording: { recording_id: 'shadow-1' }, step_recording: null,
      }] });
    } else if (/SELECT\s+ac\.certificate_id/.test(sql)) {
      callback(null, { rows: [{
        certificate_id: 'btc-id', certificate_name: 'BTC', course_name: 'Second Trimester',
        module_name: 'Biometry', unit_name: 'BPD & HC', resource_id: 'resource-1',
        resource_name: 'Practice 1', resource_type: 'Practice', resource_topic: '',
      }] });
    } else {
      callback(null, { rows: [] });
    }
  },
};

const connectionPath = require.resolve('../utils/conn');
require.cache[connectionPath] = {
  id: connectionPath, filename: connectionPath, loaded: true, exports: client,
};

const { indDatauuid } = require('../model/traineem');

test('VR trainee API adds a scan-center custom course inside its BTC unit', async () => {
  const result = await indDatauuid({ role: 103, centre_id: 'centre-1' }, 'person-1', true);
  assert.equal(result.code, 200);
  assert.equal(result.loginContext, 'vr');
  assert.deepEqual(result.certificates[0].courses.map(course => course.course_name), ['Second Trimester']);
  const unit = result.certificates[0].courses[0].modules[0].units[0];
  assert.equal(unit.unit_name, 'BPD & HC');
  assert.equal(unit.practices.length, 1);
  assert.equal(unit.add_on_courses.length, 1);
  assert.equal(unit.add_on_courses[0].course_name, 'Scan practice');
  assert.equal(unit.add_on_courses[0].is_add_on, true);
  const addOnQuery = queries.find(({ sql }) => /course_mapping_placements cmp/.test(sql));
  assert.match(addOnQuery.sql, /cmp\.centre_id = ud\.centre_id/);
  assert.match(addOnQuery.sql, /cm\.owner_centre_id = ud\.centre_id/);
});
