import React, { useState } from 'react'
// root
import Bisection from './component/root/bisection.jsx'
import Graphical from './component/root/graphical.jsx'
import Falsepo from './component/root/falseposition.jsx'
import One from './component/root/onepoint.jsx'
import Newton from './component/root/newton.jsx'
import Secant from './component/root/secant.jsx'

// linear
import Cramers from './component/linear/cramer.jsx'
import Eliminate from './component/linear/gausseliminate.jsx'
import Jordan from './component/linear/gaussjordan.jsx'
import Inversion from './component/linear/inversion.jsx'
import Lu from './component/linear/LU.jsx'
import Jacobi from './component/linear/jacobi.jsx'
import Seidel from './component/linear/gaussseidel.jsx'

import Nav from './nav.jsx'

const Topics = {
  "Root of Equation": {
    "Graphical Methods": <Graphical/>,
    "Bisection Search": <Bisection/>,
    "False-position Methods": <Falsepo/>,
    "One-point Iteration Methods": <One/>,
    "Newton-Raphson Methods": <Newton/>,
    "Secant Methods": <Secant/>
  },
  "Linear Algebra Equation": {
    "Cramer's Rule" : <Cramers/>,
    "Guass Elimination": <Eliminate/>,
    "Guass Jordan Elimination": <Jordan/>,
    "Matrix Inversion": <Inversion/>,
    "LU Decomposition Methods": <Lu/>,
    "Jacobi Iteration Methods": <Jacobi/>,
    "Gauss-Seidel Iteration Methods": <Seidel/>,
    "Conjugate Gradient Methods": null
  },
  "Interpolation": {
    "Newton Divided-differences": null,
    "Lagrange Interpolation": null,
    "Spline Interpolation": null
  },
  "Extrapolation": {
    "Simple Regression":  null,
    "Multiple Regression": null
  },
  "Integration": {
    "Trapezoidal Rule": null,
    "Composite Trapezoidal Rule": null,
    "Simpson Rule": null,
    "Composite Simpson Rule": null
  },
  "Differentiation": {
    "Numerical Differentiation": null
  }
}

function base() {
  const [ topic, setTopic ] = useState("Root of Equation");
  const [ subtopic, setSubtopic ] = useState("Graphical Methods");
  const [ topicOpen, setTopicOpen ] = useState(false);
  const [ subTopicOpen, setSubtopicOpen ] = useState(false);
  return (
    <>
    <Nav/>
    <div className='flex flex-col min-h-screen w-9/12 mx-auto'>
      <div className='flex gap-5 mx-auto my-14 '>
        <div className='relative group mr-10'>
          <button id="TopicButton" onMouseEnter={() => setTopicOpen(topic ? topic:!topic)}
                                  onClick={() => setTopicOpen(!topicOpen)}
           class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 " type="button">{topic} <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg>
          </button>

          { topicOpen && (
            <div id="TopicDropDown" class="absolute z-10 mt-5 mx-auto bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 ">
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                {
                  Object.keys(Topics).map((topic) => (
                    <li key={topic}>
                      <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => {setTopic(topic); setTopicOpen(false); setSubtopicOpen(false);}}>{topic}</a>
                    </li>
                  ))
                }
              </ul>
            </div>
          )}
        </div>
        <div>
          <button id="subTopicButton" onMouseEnter={() => setSubtopicOpen(subTopicOpen ? subTopicOpen:!subTopicOpen)}
                                      onClick={() => setSubtopicOpen(!subTopicOpen)} 
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">{subtopic} <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg>
          </button>

          { subTopicOpen && (
            <div id="subTopicDropDown" class="absolute z-10 mt-5 mx-auto bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                {
                  topic && Object.keys(Topics[topic]).map((subtopics) => (
                    <li key={subtopics}>
                      <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => {setTopicOpen(false);setSubtopic(subtopics); setSubtopicOpen(false);}}>{subtopics}</a>
                    </li>
                  ))
                }
              </ul>
            </div>
          )}
        </div>
      </div>
      { topic && subtopic && Topics[topic][subtopic] }
    </div>
    </>
  )
}

export default base