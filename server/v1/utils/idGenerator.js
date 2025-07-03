async function generateAnuIdForRequester(){
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}${mm}${dd}`;
    const count = await Trainee.countDocuments({
        role: 103,
        anuId: { $regex: `^ANUT-${todayStr}-` }
    });
    const newId = `ANUT-${todayStr}-${String(count + 1).padStart(4, '0')}`;
    return newId;
}
generateAnuIdForRequester().then((anuId) => {
    console.log(`Generated ANU ID: ${anuId}`);
}).catch((error) => {
    console.error('Error generating ANU ID:', error);
});
