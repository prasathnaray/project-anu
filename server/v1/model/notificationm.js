const supabase = require('../supaBaseClient.js');
const tagCourseNotification = async({user_id, course_id}) => {
    return await supabase
        .from('course_availability')
        .insert({
            user_id: user_id,
            course_id: course_id,
        });
}
module.exports = tagCourseNotification;
