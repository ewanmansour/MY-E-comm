import React from 'react'
import { Link } from 'react-router-dom'

const EmptyState = ({ title, message, actionText, actionTo, onAction }) => {
    const actionClass = 'mt-5 inline-flex bg-[#2f2426] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#5f7f72]'

    return (
        <div className='border border-[#dce8df] bg-white px-6 py-12 text-center shadow-sm'>
            <p className='text-lg font-semibold text-[#2f3430]'>{title}</p>
            {message && <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-[#6f7c73]'>{message}</p>}
            {actionTo && actionText && (
                <Link to={actionTo} className={actionClass}>
                    {actionText}
                </Link>
            )}
            {onAction && actionText && (
                <button type='button' onClick={onAction} className={actionClass}>
                    {actionText}
                </button>
            )}
        </div>
    )
}

export default EmptyState
