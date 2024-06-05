import React from 'react'
import { Link } from 'react-router-dom'

function PostCard({post}) {
  return (
    <div className='group relative w-full border h-[400px] overflow-hidden rounded-lg sm:w-[430px]'>
        <Link to={`/post/${post.slug}`}>
            <img src={post.image} className='h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20'/>
        </Link>
        <div className='p-3 flex flex-col gap-2'>
            <p className='text-lg font-semibold line-clamp-2'>{post.title}</p>
            <span className='italic text-sm'>{post.category?.name}</span>
            <Link to={`/post/${post.slug}`} className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-cyan-500 text-cyan-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'>
                Read Article
            </Link>
        </div>
    </div>
  )
}

export default PostCard