import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'
import GetCoursesAPI from '../../../API/GetCoursesAPI';
import getChapterAPI from '../../../API/getChapterAPI';
import nodata from '../../../assets/No data-bro.svg';
import ChapterCompletion from '../../../charts/ChapterCompletion';
import GetModuleApi from '../../../API/GetModuleAPI';
import TraineesPerBatch from '../../../charts/TraineesPerBatch';
function CourseA() {
  const [courseOption, setCourseOption] = React.useState([]);
  const [courseId, setCourseId] = React.useState({
    course_id: '',
  });
  const [chapterId, setChapterId] = React.useState({
    chapter_id: '',
  })
  const [chapterData, setChapterData] = React.useState([]);
  const getCoursesCall = async() => {
    try{
      let token = localStorage.getItem('user_token');
      let response = await GetCoursesAPI(token);
      //console.log(response.data.result);
      setCourseOption(response.data.result);
    }
    catch(err)
    {
      console.log(err)
    }
  }
  
  const handleChange = (e) => {
    const {name, value} = e.target;
    setCourseId({
            ...courseId,
            [name]: value,
    });
    getChaptersCall(value);
  }
  const ChapterHandleChange = (e) => {
    const {name, value} = e.target;
    setChapterId({
            ...chapterId,
            [name]: value,
    });
    getModulesCall(value);
  }
  const getChaptersCall = async(courseId) => {
    try
    {
      let token = localStorage.getItem('user_token');
      let response = await getChapterAPI(token, courseId);
      setChapterData(response.data);
    }
    catch(err)
    {
      console.log(err)
    }
  }
  const [moduleData, setModuleData] = React.useState([]);
  const getModulesCall = async(chapter_id) => {
    try
    {
      let token = localStorage.getItem('user_token');
      let response = await GetModuleApi(token, chapter_id);
      setModuleData(response.data);
    }
    catch(err)
    {
      console.log(err);
    }
  }
  console.log(moduleData);
  React.useEffect(() => {
    getCoursesCall();
  }, [])
  return (
    <div className="grid grid-cols-3 gap-3 px-2 pt-3">
          <div className="bg-white col-span-2 border p-2 h-[calc(100vh-5rem)] mb-2 overflow-y-auto">
                          <div className="flex justify-between items-center">
                                            <div className="w-[250px]">
                                                  <FormControl fullWidth variant="outlined" size="small" sx={{ minHeight: '35px' }}>
                                                    <InputLabel id="program-select-label">Select Course</InputLabel>
                                                    <Select
                                                      labelId="program-select-label"
                                                      value={courseId.course_id}
                                                      onChange={handleChange}
                                                      label="Select Course"
                                                      name="course_id"
                                                    >
                                                      {(courseOption || []).map((opt) => (
                                                        <MenuItem key={opt.course_id} value={opt.course_id}>
                                                          {opt.course_name}
                                                        </MenuItem>
                                                      ))}
                                                    </Select>
                                                  </FormControl>
                                            </div>
                                            <div className="font-semibold text-gray-500 px-2">Chapters Completed by Trainees</div>
                          </div>
                          <div className="mt-4">
                                            {courseId.course_id ? (
                                                <>
                                                      <ChapterCompletion data={chapterData} />
                                                </>
                                            ): (
                                                <div id='null'>
                                                      <div className="flex justify-center items-center"><img src={nodata} alt="nodata" className="w-[30%]"/></div>
                                                      <div className='text-center pb-2'>Please select the course</div>
                                                </div>
                                            )}
                                                
                          </div>
          </div>
          <div className="bg-white col-span-1 border h-[calc(100vh-5rem)] p-2 mb-2 overflow-y-auto">
                          <div className="flex justify-between items-center">
                                            <div className="w-[150px]">
                                                  <FormControl fullWidth variant="outlined" size="small" sx={{ minHeight: '35px' }}>
                                                    <InputLabel id="program-select-label">Select Chapter</InputLabel>
                                                    <Select
                                                      labelId="program-select-label"
                                                      value={chapterId.chapter_id}
                                                      onChange={ChapterHandleChange}
                                                      label="Select Chapter"
                                                      name="chapter_id"
                                                    >
                                                      {(chapterData || []).map((opt) => (
                                                        <MenuItem key={opt.chapter_id} value={opt.chapter_id}>
                                                          {opt.chapter_name}
                                                        </MenuItem>
                                                      ))}
                                                    </Select>
                                                  </FormControl>
                                            </div>
                                            <div className="font-semibold text-gray-500 px-2">Modules Completed</div>
                          </div>
                          <div className="">
                                    {chapterId.chapter_id ? 
                                    (
                                        <>
                                               <ChapterCompletion data={moduleData.stats} />
                                        </>
                                    ) : 
                                    (
                                        <div id='null'>
                                                      <div className="flex justify-center items-center"><img src={nodata} alt="nodata" className="w-[50%]"/></div>
                                                      <div className='text-center pb-2'>Please select the Chapter</div>
                                        </div>
                                    )}
                          </div>
          </div>
    </div>
  )
}

export default CourseA