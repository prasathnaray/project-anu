const appendCustomCourseAddOns = (certificates, mappings) => {
  const btc = certificates.find((certificate) => certificate.certificate_name === 'BTC');
  if (!btc) return certificates;

  for (const course of btc.courses) {
    for (const module of course.modules) {
      for (const unit of module.units) {
        unit.add_on_courses = Array.isArray(unit.add_on_courses) ? unit.add_on_courses : [];
        const existingIds = new Set(unit.add_on_courses.map((addOn) => addOn.mapping_id));

        for (const mapping of mappings) {
          if (mapping.tagged_unit_name !== unit.unit_name || !mapping.mapping_id || existingIds.has(mapping.mapping_id)) continue;
          existingIds.add(mapping.mapping_id);
          unit.add_on_courses.push({
            mapping_id: mapping.mapping_id,
            course_name: mapping.course_name,
            is_add_on: true,
            course_type: mapping.course_type,
            description: mapping.description,
            doctor_name: mapping.doctor_name,
            cluster_id: mapping.cluster_id,
            cluster_name: mapping.cluster_name,
            shadow_recording: mapping.shadow_recording,
            step_recording: mapping.step_recording,
          });
        }
      }
    }
  }
  return certificates;
};

module.exports = { appendCustomCourseAddOns };
