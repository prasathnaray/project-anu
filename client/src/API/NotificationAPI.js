const fetchCount = async (adminId) => {
  const { count, error } = await supabase
    .from("course_availability")
    .select("*", { count: "exact", head: true }) 
    .eq("user_id", adminId)
    .is("access_status", null); // only pending (unread)

  if (error) {
    console.error("Error fetching count:", error);
    return 0;
  }

  return count;
};
export default fetchCount;