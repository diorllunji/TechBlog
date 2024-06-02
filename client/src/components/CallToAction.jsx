import { Button } from 'flowbite-react'
import React from 'react'

function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500
    justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className='flex-1 justify-center flex flex-col ml-20'>
            <h2 className='text-2xl'>Want to expand your programming skills?</h2>
            <p className='text-gray-500 my-2'>Check out these resources with different exercises on different languages</p>
            <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl-rounded-bl-none'>
                <a href="https://www.exercism.org/" target='_blank' rel='noopener noreferrer'>
                    Exercism
                    </a>
                </Button>
        </div>
        <div className='p-7 ml-40 flex-1'>
            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpuYdLEzBvwemix8pwsncUkLLOQqnByncadg&s'>

            </img>
        </div>
    </div>
  )
}

export default CallToAction