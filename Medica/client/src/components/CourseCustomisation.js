import { ArrowUpWideNarrow } from 'lucide-react'
import React from 'react'

function CourseCustomisation() {
  return (
    <>
            <div className="text-lg font-semibold text-gray-500 py-4">Customized Courses</div>
            <table className="w-full text-left border-collapse mt-5">
                  <thead>
                    <tr className="border-b border-gray-300 shadow-sm">
                      <th className="py-2 px-4 text-[#8DC63F] flex items-center gap-2">
                        <div>Course Name</div>
                        <button>
                          <ArrowUpWideNarrow size={20} />
                        </button>
                      </th>
                    </tr>
                  </thead>
            </table>
    </>
  )
}

export default CourseCustomisation